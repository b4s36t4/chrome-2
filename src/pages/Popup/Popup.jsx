import React, { useEffect, useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [selectedAccount, setSelectAccount] = useState();
  const [availableAccounts, setAvailableAccounts] = useState();
  const [accountIndex, setAccountIndex] = useState(0);
  useEffect(() => {
    const call = async () => {
      const accounts = await chrome.storage.local.get("accounts")
      if (!accounts || Object.entries(accounts).length < 1) {
        console.log("No Saved Accounts")
      } else {
        setAvailableAccounts(JSON.parse(accounts['accounts']))
      }
    }
    call()
  }, [])
  useEffect(() => {
    const call = async () => {
      const selectedOne = await chrome.storage.local.get("selected_account")

      if (!selectedOne || Object.entries(selectedOne).length < 1) {
        setSelectAccount("")
      } else {
        setSelectAccount(selectedOne['selected_account'])
      }
    }
    call()
  }, [])

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "local") {
        const keys = Object.keys(changes)
        const isRelaodable = keys.includes("accounts") || keys.includes("selected_account") || keys.includes("account_index")
        if (isRelaodable) {
          window.location.reload()
        }
      }
    })

    chrome.runtime.onMessage.addListener((msg, sender) => {
      console.log(msg, "asdas")
      return true;
    })
  }, [])

  const chooseAccount = async () => {
    console.log(accountIndex)
    if (accountIndex !== undefined) {
      const account = availableAccounts[accountIndex];
      console.log(account)
      await chrome.storage.local.set({ "selected_account": account })
      await chrome.storage.local.set({ "account_index": accountIndex })
      // window.location.reload()
    } else return
  }

  const deleteAccount = async () => {
    await chrome.storage.local.clear()
    // window.location.reload();
  }
  const doLogin = async () => {
    chrome.runtime.sendMessage({ type: "choose_accounts" }, (res) => {
      console.log(res)
    })
  }

  const createMeet = async () => {
    if (selectedAccount) {
      const accountIndex = await chrome.storage.local.get(["account_index"])
      const index = accountIndex["account_index"]
      if (index) {
        const url = `https://meet.google.com/new?authuser=${index}`
        chrome.runtime.sendMessage({ "type": "create_meet", "link": url }, (res) => {
          console.log(res)
        })
      }
    }
  }
  return (
    <div className="App">
      <p className='title'>Create Your meet Here</p>

      <div className='container'>
        {selectedAccount ?
          <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <code className='email'>{`Using Account ${selectedAccount}`}</code>
            <div style={{ marginTop: 20 }}>
              <button onClick={createMeet} className='button'> Create Meet </button>
            </div>
          </div>
          :
          availableAccounts && (
            <div>
              <select onChange={(e) => setAccountIndex(e.target.value)} value={accountIndex} placeholder='Select Account'>
                <option disabled value={-1}>Select Account</option>
                {(availableAccounts || []).map((account, index) => {
                  return (<option key={account} value={index}>{account}</option>)
                })}
              </select>

              <button onClick={chooseAccount} className='button' style={{ display: "block", margin: '10px auto' }}>Choose Account</button>
            </div>
          )
        }
      </div>
      {selectedAccount || availableAccounts ? <button style={{ marginTop: 40 }} onClick={deleteAccount} className='button'>Log Out</button> :

        <button onClick={doLogin} className='button'>Login</button>
      }
    </div>
  );
};

export default Popup;
