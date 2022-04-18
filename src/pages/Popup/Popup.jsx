import React, { useEffect, useRef, useState } from 'react';
import { COPY_URL, CREATE_DONE, MEET_CREATE, STORAGE_CHANGE } from '../../constants';
import { getChoosenAccount, choose_accounts, deleteAccount, getSaveAccounts, createMeetTab, removeSelectedAccount } from '../../utils';
import './Popup.css';

const Popup = () => {
  const [selectedAccount, setSelectAccount] = useState("");
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [accountIndex, setAccountIndex] = useState(0);
  const [meetUrl, setMeetUrl] = useState("");
  const meetRef = useRef(null)
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
    chrome.runtime.onMessage.addListener(async (msg, sender, callBack) => {
      console.log(msg);
      if (msg.type === STORAGE_CHANGE && msg.event === "change") {
        window.location.reload()
      }
      else if (msg.type === CREATE_DONE) {
        const createdMeetUrl = msg.url
        setMeetUrl(createdMeetUrl)
      }
      else if (msg.type === MEET_CREATE) {
        const isShortcutTab = msg?.shortcut;
        console.log(msg, callBack)
        if (selectedAccount) {
          createMeet();
          callBack(true)
        }
        else {
          const choosenAccount = await getChoosenAccount();
          const accountIndex = await chrome.storage.local.get(["account_index"])
          const index = accountIndex["account_index"]
          if (!choosenAccount || index === undefined) {
            console.log("going..", choosenAccount, index)
            callBack(true);
            return
          };
          const url = `https://meet.google.com/new?authuser=${index}`
          await createMeetTab(url)
          callBack(true)
        }
      }
      else if (msg.type === COPY_URL) {
        console.log("copying...")
        const url = msg.url
        copyToClipBoard(url)
        const currentTab = await chrome.tabs.query({ currentWindow: true, active: true })
        console.log(currentTab[0].id)
        // chrome.tabs.remove(currentTab[0].id)
      }
      callBack(true)
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

  const copyToClipBoard = (url) => {
    if (url) {
      console.log(url, "url")
      navigator.clipboard.writeText(url);
      return
    }

    navigator?.clipboard.writeText(meetUrl)
    console.log("done copied")
  }
  const doLogin = async () => {
    choose_accounts()
  }

  const createMeet = async () => {
    if (selectedAccount) {
      const accountIndex = await chrome.storage.local.get(["account_index"])
      const index = accountIndex["account_index"]
      console.log(index)
      if (index !== null) {
        const url = `https://meet.google.com/new?authuser=${index}`
        createMeetTab(url)
      }
    }
  }
  return (
    <div className="App">
      <p className='title'>Create Your meet Here</p>

      <div className='container'>
        {selectedAccount ?
          <div className='flex-center'>
            <code className='email'>{`Using Account ${selectedAccount}`}</code>
            {meetUrl &&
              <div className='mt-20 center-text'>
                <div ref={meetRef}>{meetUrl}</div>

                <div onClick={copyToClipBoard} style={{ width: 'max-content', cursor: "pointer", fontWeight: '700', marginTop: 10, border: '1px solid black', padding: '5px 10px' }}>Copy</div>
              </div>
            }
            <div className='mt-20'>
              <button onClick={createMeet} className='button'> Create Meet </button>
            </div>
            <div className='mt-20'>
              <button onClick={removeSelectedAccount} className='button'> Change Account </button>
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
