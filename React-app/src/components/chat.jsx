


import React, { useRef, useState, useEffect } from 'react';
import { ArrowUp, User } from 'lucide-react';
import { APIkey } from '../config';
import ReactMarkdown from 'react-markdown';

// 1. FIXED: Wrapped props in curly braces {}
const Chat = ({ msg, setmsg }) => {
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');

  const handleRef = useRef(null);

  const addMessage = (msg, sender) => {
    const id = `${Date.now()}-${Math.random()}`;
    setmsg((prev) => [
      ...prev,
      {
        id,
        msg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender,
      },
    ]);
    return id;
  };

  function questionMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    addMessage(trimmed, 'user');
    setQuestion(trimmed);
    setInput('');
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      questionMessage();
    }
  };

  useEffect(() => {
    if (!question) return;

    const fetchResponse = async () => {
      // Safely handle cases where 'msg' might briefly be undefined on initial mount
      const safeMsg = Array.isArray(msg) ? msg : [];

      const apimsg = safeMsg
        .filter((m) => m.msg !== '') 
        .map((m) => ({
          role: m.sender === 'bot' ? 'assistant' : 'user',
          content: m.msg,
        }));

      apimsg.push({ role: 'user', content: question });

      const botMessageId = addMessage('', 'bot');

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${APIkey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-OpenRouter-Title': 'My Testing App',
          },
          body: JSON.stringify({
            model: 'poolside/laguna-s-2.1:free',
            messages: apimsg, // 2. FIXED: Changed 'message' to 'messages'
            stream: true, 
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
        }

        if (!response.body) throw new Error('No readable response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const cleanedLine = line.trim();
            if (!cleanedLine || cleanedLine === 'data: [DONE]') continue;

            if (cleanedLine.startsWith('data: ')) {
              try {
                const parsedJson = JSON.parse(cleanedLine.replace('data: ', ''));
                const token = parsedJson?.choices?.[0]?.delta?.content || '';

                if (token) {
                  accumulatedText += token;

                  setmsg((prev) =>
                    prev.map((m) =>
                      m.id === botMessageId ? { ...m, msg: accumulatedText } : m
                    )
                  );
                }
              } catch (e) {
                // Skips incomplete streaming chunks safely
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setmsg((prev) =>
          prev.map((m) =>
            m.id === botMessageId ? { ...m, msg: `Error: ${error.message}` } : m
          )
        );
      } finally {
        setQuestion('');
      }
    };

    fetchResponse();
  }, [question]);

  useEffect(() => {
    // 3. FIXED: Changed 'behaviour' to 'behavior'
    handleRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <div className='w-full h-full bg-[#09070f] overflow-hidden flex flex-col'>
      <div className='flex flex-col w-full sm:max-w-[70%] h-full py-5 mx-auto px-4 overflow-hidden'>

        <section className='bg-[#120e1c] w-full flex-1 min-h-0 h-full sm:max-h-[400px] overflow-y-auto rounded-xl p-4 mb-4 shadow-2xl border border-slate-800/50'>
          {Array.isArray(msg) && msg.map((item) => (
            <React.Fragment key={item.id}>
              <div className={`flex gap-3 ${item.sender === 'bot' ? 'justify-start' : 'justify-end'} p-2`}>
                {item.sender === 'user' ? (
                  <User className='h-10 w-10 text-yellow-400 bg-slate-800 border border-slate-700 rounded-full order-last p-3' />
                ) : (
                  <img src="../myAvatar (2).svg" className='h-10 w-10 bg-slate-800 border border-slate-700 rounded-full' alt="AI" />
                )}

                <div className={`rounded-lg px-3 py-2 max-w-[80%] shadow-sm ${item.sender === 'bot'
                    ? 'bg-[#1e172e] text-slate-100 border border-slate-700/40'
                    : 'bg-purple-500 text-white'}`}>
                  {item.msg ? (
                    <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                      <ReactMarkdown>
                        {item.msg}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-slate-400 whitespace-pre-wrap animate-pulse">Thinking...</p>
                  )}
                  <span className='text-[10px] block text-right opacity-50 mt-1 font-mono'>{item.time}</span>
                </div>
              </div>
              <div ref={handleRef}></div>
            </React.Fragment>
          ))}
        </section>

        <div className='flex w-full items-center border border-slate-800 rounded-2xl bg-[#1a1429] overflow-hidden shadow-xl flex-shrink-0 focus-within:border-indigo-500/50 transition-colors duration-200'>
          <textarea
            className='bg-transparent flex-1 pl-6 pr-2 py-4 resize-none focus:outline-none text-slate-100 placeholder-slate-500 max-h-32 overflow-y-auto text-sm'
            placeholder='Type a message...'
            rows={1}
            name='message'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={questionMessage}
            className='p-4 text-slate-400 hover:text-indigo-400 transition-colors duration-200'
          >
            <ArrowUp size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;
