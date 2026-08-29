


import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';

import Sidebar from "./components/Sidebar";
import Header from "./components/header";
import EmptyChatState from "./components/EmptychatState";
import Chat from "./components/chat";

const App = () => {
  const [message, setmessage] = useState([]);
  const navigate = useNavigate();

  // Load the initial saved historical session arrays on layout mount
  const [entirelist, setentirelist] = useState(() => {
    const cachedData = localStorage.getItem('Global_Chat_Sessions');
    return cachedData ? JSON.parse(cachedData) : [];
  });

  function chatrecover(session) {
    setmessage(session);
    navigate("/chat"); // Automatically redirect to the active workspace on item select
  }

  return (
    <div className="flex w-screen h-screen">
      <Sidebar 
        msg={message} 
        setmsg={setmessage} 
        list={entirelist} 
        setlist={setentirelist} 
        recoverchat={chatrecover} 
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route index element={<EmptyChatState />} />
            <Route path="chat" element={<Chat msg={message} setmsg={setmessage} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
