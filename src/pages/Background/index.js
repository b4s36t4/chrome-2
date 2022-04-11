

// chrome.webNavigation.onCompleted.addListener((details) => {
//     chrome.runtime.sendMessage({ type: "meet_url", "url": details.url })
//     return true;
// }, { url: [{ urlContains: "meet" }] })

import { COPY_URL, CREATE_DONE, MEET_CREATE, STORAGE_CHANGE } from "../../constants";
import { copyMeetURL } from "../../utils";

// chrome.runtime.onMessage.addListener((msg, _, callBack) => {
//     console.log("Got a message")
//     if (typeof msg === "object") {
//         const { type } = msg
//         if (type === "choose_accounts") {
//             choose_accounts(callBack)
//         }
//         if (type === "create_meet") {
//             const { link } = msg
//             chrome.tabs.create({ url: link, active: false })
//                 .then((tab) => {
//                     callBack(true)
//                     chrome.webNavigation.onCompleted.addListener((details) => {
//                     }, { url: [{ urlContains: "meet.google.com" }] })
//                 })
//         }
//     }
//     return true;
// })

chrome.storage.onChanged.addListener((changes, namespace) => {
    chrome.runtime.sendMessage({ "type": STORAGE_CHANGE, "event": "change" })
})

chrome.webNavigation.onCompleted.addListener((details) => {
    console.log(details);
    if (details.tabId) {
        const url = details.url;
        chrome.runtime.sendMessage({ "type": CREATE_DONE, url }, (res) => {
            chrome.scripting.executeScript({ func: copyMeetURL, target: { tabId: details.tabId } }).then((res) => {
                res.forEach(result => {
                    if (result) {
                        chrome.runtime.sendMessage({ type: COPY_URL, "url": result.result })

                    }
                });
            })
            return true
        })
        return true
    }
}, { url: [{ urlContains: "meet.google.com" }] })



chrome.commands.onCommand.addListener(async (command) => {
    const tab = await chrome.tabs.create({ url: 'popup.html' })
    setTimeout(async () => {
        chrome.runtime.sendMessage({ "type": MEET_CREATE, tabId: tab.id })
    }, 1000)
})