// import { useState } from "react";

// import { Plus , Search } from 'lucide-react';


// const Sidebar = () => {
// const [close, setclose] = useState(false)
//   return (
//     <div className={`h-screen bg-green-100 py-6 px-4 ${close ? 'w-25' : 'w-70'} `}>
//         <div className="flex justify-between items-center ">
//   <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden shadow-inner">
//   <img 
//     src= {"/myAvatar (2).svg"}
//     alt="AI Assistant" 
//     className="w-full h-full object-contain scale-110 translate-y-0.5" 
//   />
// </div>
//   <svg class="hs-overlay-minified:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
//             <rect width="18" height="18" x="3" y="3" rx="2"></rect>
//             <path d="M15 3v18"></path>
//             <path d="m10 15-3-3 3-3"></path>
//           </svg>
//         </div>
//         <div className="pt-5 py-9">
//         <div className="flex px-4 py-3 transition-all duration-300 ease-in-out gap-2 items-center justify-start hover:border-l-4 hover:rounded-lg ">
//             <Plus size={20} className={"text-black"} />
//            <p>New Chat</p>
//         </div>
//         <div className="flex px-4 py-3 transition-all duration-300 ease-in-out gap-2 items-center justify-start hover:border-l-4 hover:rounded-lg ">
//             <Search size={20} className={"text-black"} />
//            <p>Search Chat</p>
//         </div>
//         <p className="pt-5">Recent Chats</p>
//         </div>
//     </div>
//   )
// }
// export default Sidebar



import { useState } from "react";
import { Plus, Search } from "lucide-react";

const Sidebar = () => {
  const [close, setClose] = useState(true);

  return (
    <div
      className={`relative z-50  h-screen bg-slate-900 border-r border-slate-800 py-6 px-4 flex flex-col justify-between transition-all duration-300 ease-in-out relative z-50 ${
        close ? "w-20" : "w-72"
      }`}
    >
      <div>
        <div className={`flex justify-between items-center mb-8  `}>
          <div
            className={`${close ?  'hidden' :  'w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden shadow-md shrink-0 transition-all duration-300 ease-in-out' }`}
          >
            <img
              src="/myAvatar (2).svg"
              alt="AI Assistant"
              className= "w-full h-full object-contain scale-110"
            />
          </div>

          <button
            onClick={() => setClose(!close)}
            className={`p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all duration-300  ${
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
          <div className="flex px-3 py-2.5 rounded-xl gap-3 items-center justify-start cursor-pointer group text-slate-300 bg-gradient-to-r from-indigo-600/10 to-transparent border border-indigo-500/20 hover:from-indigo-600/20 hover:border-indigo-500/40 transition-all duration-200">
            <Plus
              size={18}
              className="text-indigo-400 shrink-0 group-hover:scale-110 transition-transform duration-200"
            />
            {!close && <p className="text-sm font-medium text-indigo-100">New Chat</p>}
          </div>

          <div className="flex px-3 py-2.5 rounded-xl gap-3 items-center justify-start cursor-pointer group text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent hover:border-slate-800 transition-all duration-200">
            <Search size={18} className="shrink-0" />
            {!close && <p className="text-sm font-medium">Search Chat</p>}
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

          {!close && (
            <p className="px-3 py-4 text-xs italic text-slate-600">No recent conversations</p>
          )}
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

