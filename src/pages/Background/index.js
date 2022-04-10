

// chrome.webNavigation.onCompleted.addListener((details) => {
//     chrome.runtime.sendMessage({ type: "meet_url", "url": details.url })
//     return true;
// }, { url: [{ urlContains: "meet" }] })

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
    chrome.runtime.sendMessage({ "type": "storage", "event": "change" })
})

chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (details.tabId) {
        const url = details.url;
        chrome.runtime.sendMessage({ "type": "meet_done", url })
    }
}, { url: [{ urlContains: "meet.google.com" }] })