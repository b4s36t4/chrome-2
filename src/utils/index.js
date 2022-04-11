const getEmails = () => {
    const mailNodes = document.querySelectorAll(".wLBAL")
    const mails = []
    mailNodes.forEach((node) => mails.push(node.textContent))
    console.log(mails)
    return { "mails": mails }
}


export const choose_accounts = () => {
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
            })
        }
        return true
    })
}

// export const chooseAccount = async (accountIndex, availableAccounts) => {
//     if (accountIndex !== undefined) {
//         const account = availableAccounts[accountIndex];
//         await chrome.storage.local.set({ "selected_account": account })
//         await chrome.storage.local.set({ "account_index": accountIndex })
//         // window.location.reload()
//     } else return
// }

export const deleteAccount = async () => {
    await chrome.storage.local.clear()
    // window.location.reload();
}

export const getSaveAccounts = async () => {
    const accounts = await chrome.storage.local.get("accounts")
    if (!accounts || Object.entries(accounts).length < 1) {
        return null
    } else {
        return JSON.parse(accounts["accounts"])
    }
}

export const getChoosenAccount = async () => {
    const selectedOne = await chrome.storage.local.get("selected_account")
    if (!selectedOne || Object.entries(selectedOne).length < 1) {
        return null;
    }
    else {
        return selectedOne["selected_account"]
    }
}

export const createMeetTab = async (url) => {
    chrome.tabs.create({ url: url, active: false })
        .then((tab) => {
            console.log("Created Tab", tab)
        })

    return true
}

export const removeSelectedAccount = async () => {
    chrome.storage.local.remove("selected_account")
    chrome.storage.local.remove("account_index")
}

export const copyMeetURL = async () => {
    const url = window && window.location.href
    return url
}