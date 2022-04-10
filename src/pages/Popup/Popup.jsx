import React, { useEffect, useState } from 'react';
import { getChoosenAccount, choose_accounts, deleteAccount, getSaveAccounts } from '../../utils';
import './Popup.css';

const Popup = () => {
  const [selectedAccount, setSelectAccount] = useState();
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [accountIndex, setAccountIndex] = useState(0);
  useEffect(() => {
    const call = async () => {
      const saveAccounts = await getSaveAccounts()
      setAvailableAccounts(saveAccounts);
    }
    call()
  }, [])
  useEffect(() => {
    const call = async () => {
      const choosenAccount = await getChoosenAccount();
      if (!choosenAccount) {
        setSelectAccount("")
      }
      else {
        setSelectAccount(choosenAccount)
      }
    }
    call()
  }, [])


  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, _) => {
      if (msg.type === "storage" && msg.event === "change") {
        window.location.reload()
      }
      return true
    })
  }, [])

  const chooseAccount = async () => {
    if (accountIndex !== undefined) {
      const account = availableAccounts[accountIndex];
      await chrome.storage.local.set({ "selected_account": account })
      await chrome.storage.local.set({ "account_index": accountIndex })
      // window.location.reload()
    } else return
  }

  const doLogin = async () => {
    choose_accounts()
  }

  const createMeet = async () => {
    if (selectedAccount) {
      const accountIndex = await chrome.storage.local.get(["account_index"])
      const index = accountIndex["account_index"]
      if (index !== null) {
        const url = `https://meet.google.com/new?authuser=${index}`
        console.log(url)
        chrome.tabs.create({ url: url, active: false })
          .then((tab) => console.log("Created Tab", tab))
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
