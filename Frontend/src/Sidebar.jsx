import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/thread");
            const res = await response.json();
            //STore only threadId and title 
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads(); //fetch all threads on component load  change in currThreadId
    }, [currThreadId])


    //Onclick function to create a new chat. 
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    //Function to change thread on click of thread from sidebar
    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            //Load previous chats of selected thread
            const response = await fetch(`http://localhost:5000/api/thread/${newThreadId}`);
            const res = await response.json();
            //console.log(res);
            setPrevChats(res);
            setNewChat(false); //not a new chat
            setPrompt(""); //clear input box
            setReply(null); //no reply yet
        } catch (err) {
            console.log(err);
        }
    }

    //Function to delete thread
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            //If deleted thread is current thread, create new chat
            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling 
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Sumit &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;