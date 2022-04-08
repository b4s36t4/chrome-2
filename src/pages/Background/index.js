const getEmails = () => {
    const mailNodes = document.querySelectorAll(".wLBAL")
    const mails = []
    mailNodes.forEach((node) => mails.push(node.textContent))
    console.log(mails)
    return { "mails": mails }
}


const choose_accounts = (callBack) => {
    chrome.tabs.create({ active: false, url: "https://accounts.google.com/accountchooser" }, (tab) => {
        if (tab) {
            chrome.scripting.executeScript({ target: { tabId: tab?.id }, func: getEmails }, async (res) => {
                if (typeof res === "object") {
                    const mailResult = res[0]
                    if (mailResult) {
                        const mails = mailResult?.result["mails"]
                        await chrome.storage.local.set({ "accounts": JSON.stringify(mails) })
                        chrome.tabs.remove(tab?.id)
                    }
                }
                callBack(true)
            })
        }
        callBack(true)
    })
}

// chrome.webNavigation.onCompleted.addListener((details) => {
//     chrome.runtime.sendMessage({ type: "meet_url", "url": details.url })
//     return true;
// }, { url: [{ urlContains: "meet" }] })

chrome.runtime.onMessage.addListener((msg, _, callBack) => {
    console.log("Got a message")
    if (typeof msg === "object") {
        const { type } = msg
        if (type === "choose_accounts") {
            choose_accounts(callBack)
        }
        if (type === "create_meet") {
            const { link } = msg
            chrome.tabs.create({ url: link, active: false })
                .then((tab) => {
                    if (tab) {
                        // callBack(true)
                        chrome.webNavigation.onCompleted.addListener((details) => {
                            if (details && details.tabId) {
                                callBack(details.url)
                            }
                        }, { url: [{ urlContains: "meet.google.com" }] })
                    }
                })
        }
    }
})