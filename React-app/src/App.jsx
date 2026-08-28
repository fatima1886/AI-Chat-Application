import React,{ useState,useEffect } from "react"
import { Routes, Route} from 'react-router-dom';

import Sidebar from "./components/Sidebar"
import Header from "./components/header"
import EmptyChatState from "./components/EmptychatState"
import Chat from "./components/chat";
// import Sidebar from "./components/Sidebar"


const App = () => {
//   // states
const [message, setmessage] = useState([])

  return (
    <><div className="flex w-screen h-screen">
      <Sidebar  msg={message} setmsg={setmessage}  />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 ">
          <Routes>
            {/* When path is EXACTLY "/", show the welcome screen */}
            <Route index element={<EmptyChatState />} />
            
            {/* When path changes to "/chat", show the chat screen */}
            <Route path="chat" element={<Chat msg={message} setmsg={setmessage} />} />
          </Routes>
        </main>



      </div>
    </div>
    
    
    </>
  )
}

export default App