import React from 'react';
import { Radar,Telescope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmptyChatState() {
     const navigate = useNavigate();
    return (
        <>
            <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 p-6 text-center font-sans">
                <div className="flex max-w-sm flex-col items-center">
                    
                  
{/* animation */}
    <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
                              <div className="relative h-23 w-23  rounded-full bg-purple-200 animate-ping [animation-duration:3s]"></div>

      {/* 1. Elegant Ambient Glow Background (Replaces aggressive ping) */}
      <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-xl [animation-duration:4s]"></div>
      <div className="absolute h-24 w-24 animate-pulse rounded-full bg-purple-500/10 blur-md [animation-duration:2.5s]"></div>

      {/* 2. Core Avatar Frame */}
      {/* Added premium ease curve, overflow-hidden to clip the image, and custom shadow drop */}
      <div className="absolute z-30  h-24 w-24 overflow-hidden rounded-2xl border-2 border-purple-500/60 bg-slate-950 shadow-2xl shadow-purple-500/10 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) hover:rotate-6 hover:scale-105 hover:border-purple-400">
        <img 
          src="/myAvatar (2).svg" 
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-120 absolute z-50" 
          alt="avatar" 
        />
      </div>

      {/* 3. Left Floating Icon (Radar) */}
      {/* Softened bounce amplitude using custom translation, added clean border accents */}
      <div className="absolute -left-8 top-2 z-40 flex h-10 w-10 animate-bounce items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/80 text-blue-400 shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-purple-500/50 hover:text-purple-400 [animation-duration:5s]">
        <Radar className="h-5 w-5" />
      </div>

      {/* 4. Right Floating Icon (Telescope) */}
      {/* Offset animation speed prevents them from moving in uniform robotic sync */}
      <div className="absolute -right-8 bottom-4 z-40 flex h-10 w-10 animate-bounce items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/80 text-blue-400 shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-purple-500/50 hover:text-purple-400 [animation-duration:6s]">
        <Telescope className="h-5 w-5" />
      </div>
                        
    </div>

                    <h2 className="text-xl font-bold tracking-tight text-white">Start a new conversation</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        Ask a question, brainstorm ideas, or just say hello. Your avatar assistant is ready to help!
                    </p>

                    
                        <button onClick={() => navigate('/chat')} className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-left transition-all animate-pulse [animation-duration-3] hover:border-indigo-500/40 hover:bg-slate-900 text-indigo-400 mt-5">
                          Start Chat
                        </button>
                   
                </div>
            </div>
        </>
    );
}
