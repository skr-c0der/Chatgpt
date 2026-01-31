import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState(""); //input prompt from user
  const [reply, setReply] = useState(null); //reply from chatgpt
  const [currThreadId, setCurrThreadId] = useState(uuidv1());   //current thread id generate 
  const [prevChats, setPrevChats] = useState([]);   //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true); //flag to check if new chat is started
  const [allThreads, setAllThreads] = useState([]); //Store all threads info

  //values to be provided by context
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  }; 

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
          <Sidebar></Sidebar>
          <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App