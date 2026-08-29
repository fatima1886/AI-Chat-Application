

import { useState } from "react";
import { Plus, Search } from "lucide-react";

const Sidebar = ({ msg, setmsg, list, setlist, recoverchat }) => {
  const [close, setClose] = useState(true);
  const [search, setsearch] = useState("");

  // FIXED FUNCTION: Saves entire history array lists securely to long-term storage
  function savemsg() {
    if (!msg || msg.length === 0) return;
    
    // Create an updated master copy containing everything
    const updatedCollection = [...list, msg];
    
    setlist(updatedCollection);
    localStorage.setItem('Global_Chat_Sessions', JSON.stringify(updatedCollection));
    setmsg([]); // Empty out active screen frame coordinates
  }

  const filteredList = list.filter((session) => {
    if (!search.trim()) return true;
    const firstMessageText = session?.[0]?.msg || "";
    return firstMessageText.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div
      className={`relative z-50 h-screen bg-slate-900 border-r border-slate-800 py-6 px-4 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        close ? "w-20" : "w-72"
      }`}
    >
      <div>
        <div className="flex justify-between items-center mb-8">
          <div
            className={`${close ? 'hidden' : 'w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden shadow-md shrink-0 transition-all duration-300 ease-in-out'}`}
          >
            <img
              src="/myAvatar (2).svg"
              alt="AI Assistant"
              className="w-full h-full object-contain scale-110"
            />
          </div>

          <button
            onClick={() => setClose(!close)}
            className={`p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all duration-300 ${
              close ? "mx-auto" : ""
            }`}
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${close ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M9 3v18"></path>
              <path d="m16 15-3-3 3-3"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex px-3 py-2.5 rounded-xl gap-3 items-center justify-start cursor-pointer group text-slate-300 bg-gradient-to-r from-indigo-600/10 to-transparent border border-indigo-500/20 hover:from-indigo-600/20 hover:border-indigo-500/40 transition-all duration-200" onClick={savemsg}>
            <Plus
              size={18}
              className="text-indigo-400 shrink-0 group-hover:scale-110 transition-transform duration-200"
            />
            {!close && <p className="text-sm font-medium text-indigo-100">New Chat</p>}
          </div>

          <div className="flex px-3 py-2.5 rounded-xl gap-3 items-center justify-start group text-slate-400 bg-slate-900 border border-transparent focus-within:border-slate-700 focus-within:bg-slate-800/60 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-800 transition-all duration-200">
            <Search size={18} className="shrink-0 group-hover:text-slate-200 transition-colors" />
            
            {!close && (
              <input 
                value={search}
                onChange={(e) => setsearch(e.target.value)} 
                type="search" 
                placeholder="Search chats" 
                className="bg-transparent text-sm font-medium text-slate-200 w-full focus:outline-none placeholder-slate-500"
              />
            )}
          </div>
        </div>

        <div className="mt-8">
          {!close ? (
            <p className="px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Recent Chats
            </p>
          ) : (
            <div className="h-px bg-slate-800 my-4" />
          )}

          {!close && filteredList.length === 0 && (
            <p className="px-3 py-4 text-xs italic text-slate-600">No conversations found</p>
          )}
          
          {!close && filteredList.map((session, index) => (
            <li 
              key={index} 
              onClick={() => recoverchat(session)} // FIXED: Wrapped cleanly into an anonymous execution arrow function callback
              className="text-sm text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 px-3 py-2 rounded-lg cursor-pointer truncate list-none transition-colors"
            >
              {session[0]?.msg || `Saved Chat #${index + 1}`}
            </li>
          ))}
        </div>
      </div>

      {!close && (
        <div className="border-t border-slate-800 pt-4 px-1 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">AI App v1.0</p>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;


