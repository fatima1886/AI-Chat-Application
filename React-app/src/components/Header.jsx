import React from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigation = useNavigate()
  return (
    <div className="relative z-20 flex justify-between items-center bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 py-4 px-6 sticky top-0 z-50">
      
      {/* 🔮 LEFT: AI Brand Branding Frame */}
      <div onClick={()=>{navigation('home')}} className="flex items-center gap-2.5 group cursor-pointer">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all duration-200">
          <Sparkles size={18} className="animate-pulse" />
        </div>
        <h1 className="text-sm font-semibold tracking-wide text-slate-200 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text">
          AI Chatbot
        </h1>
      </div>

      {/* 💬 RIGHT: Secondary Header Actions / Status Text */}
      <div className="flex items-center gap-4">
        <h1 className="text-xs font-medium text-slate-500 bg-slate-900 border border-slate-800/50 px-2.5 py-1 rounded-md">
          v1.0.0
        </h1>
      </div>

    </div>
  );
};

export default Header;
