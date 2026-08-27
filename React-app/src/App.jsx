import React,{ useState,useEffect } from "react"
import { Routes, Route} from 'react-router-dom';

import Sidebar from "./components/Sidebar"
import Header from "./components/header"
import EmptyChatState from "./components/EmptychatState"
import Chat from "./components/chat";
// import Sidebar from "./components/Sidebar"


const App = () => {
//   // states
// const [message, setmessage] = useState([])
// const [question, setquestion] = useState("")


// functions
// function firstmessage() {
//   setmessage([{id: Date.now(), msg:"Hello! I am your AI assistant. How can I help you with your project or answer your questions today?" ,  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) , sender:"bot"}])
// }

// function questionMessage(e) {
//   setmessage([...message,{id: Date.now(), msg:{question}, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender:"user"}])
// }

// // fetch api through useeffect()
// useEffect(() => {
  
//   const fetchResponse = async () => {
//     const API_KEY = APIkey
//     try {
//       const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${API_KEY}`,
//           'Content-Type': 'application/json',
//           'HTTP-Referer': window.location.origin,
//           'X-OpenRouter-Title': 'My Testing App'
//         },
//         body: JSON.stringify({
//           model: 'nvidia/nemotron-3-nano-30b-a3b:free',
//           messages: [
//             { role: 'user', content: question },
//           ],
//         }),
//       });

//       const data = await response.json();
//       console.log(data);
//       setmessage([...message,{id: Date.now(), msg:{data}, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sender:"bot"}])
//     } catch (error) {
//       console.error('Error fetching AI response:', error);
//     }
//   };

//   if (question) {
//     fetchResponse();
//   }
// }, [question]);

  return (
    <><div className="flex w-screen h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 ">
          <Routes>
            {/* When path is EXACTLY "/", show the welcome screen */}
            <Route index element={<EmptyChatState />} />
            
            {/* When path changes to "/chat", show the chat screen */}
            <Route path="chat" element={<Chat />} />
          </Routes>
        </main>



      </div>
    </div>
    
    
    </>
  )
}

export default App