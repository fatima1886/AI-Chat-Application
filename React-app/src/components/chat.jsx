

// import React, { useState, useEffect } from 'react';
// import { ArrowUp, User } from 'lucide-react';
// import { APIkey } from '../config';
// import ReactMarkdown from 'react-markdown';

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [question, setQuestion] = useState('');

//   // Modified to return a unique ID string to explicitly target during streaming updates
//   const addMessage = (msg, sender) => {
//     const id = `${Date.now()}-${Math.random()}`;
//     setMessages((prev) => [
//       ...prev,
//       {
//         id,
//         msg,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         sender,
//       },
//     ]);
//     return id;
//   };

//   function questionMessage() {
//     const trimmed = input.trim();
//     if (!trimmed) return;

//     addMessage(trimmed, 'user');
//     setQuestion(trimmed);
//     setInput('');
//   }

//   // Handle Enter to submit, Shift+Enter for new line
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       questionMessage();
//     }
//   };

//   useEffect(() => {
//     if (!question) return;

//     const fetchResponse = async () => {
//       // 1. Map existing chat state to OpenAI/OpenRouter format before appending the new placeholder
//       // This ensures we capture the conversation history up to this exact moment
//       const apiMessages = messages.map((msg) => ({
//         role: msg.sender === 'bot' ? 'assistant' : 'user',
//         content: msg.msg,
//       }));

//       // Append the current active question to the payload history array
//       apiMessages.push({ role: 'user', content: question });

//       // 2. Spawns an empty placeholder bot message first
//       const botMessageId = addMessage('', 'bot');

//       try {
//         const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${APIkey}`,
//             'Content-Type': 'application/json',
//             'HTTP-Referer': window.location.origin,
//             'X-OpenRouter-Title': 'My Testing App',
//           },
//           body: JSON.stringify({
//             model: 'nvidia/nemotron-3.5-lightning:free',
//             messages: apiMessages, // <-- CHANGED: Passed the whole history instead of just one question
//             stream: true, // Enables streaming on OpenRouter
//           }),
//         });

//         if (!response.ok) {
//           const errData = await response.json().catch(() => ({}));
//           throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
//         }

//         if (!response.body) throw new Error('No readable response body');

//         // 3. Read incoming browser stream chunks
//         const reader = response.body.getReader();
// // console.log(reader);


//         const decoder = new TextDecoder('utf-8');
//         let accumulatedText = '';

//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           const chunk = decoder.decode(value, { stream: true });
//           const lines = chunk.split('\n');

//           for (const line of lines) {
//             const cleanedLine = line.trim();
//             if (!cleanedLine || cleanedLine === 'data: [DONE]') continue;

//             if (cleanedLine.startsWith('data: ')) {
//               try {
//                 const parsedJson = JSON.parse(cleanedLine.replace('data: ', ''));
//                 const token = parsedJson?.choices?.[0]?.delta?.content || '';

//                 if (token) {
//                   accumulatedText += token;

//                   // Update the exact bot bubble step-by-step
//                   setMessages((prev) =>
//                     prev.map((msg) =>
//                       msg.id === botMessageId ? { ...msg, msg: accumulatedText } : msg
//                     )
//                   );
//                 }
//               } catch (e) {
//                 // Skips partial chunk evaluation errors
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching AI response:', error);
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.id === botMessageId ? { ...msg, msg: `Error: ${error.message}` } : msg
//           )
//         );
//       } finally {
//         setQuestion('');
//       }
//     };

//     fetchResponse();
//   }, [question]);

//   return (
//     // FIX: Set explicit h-screen viewport constraints to stop input page overflow
//     <div className='w-full h-full bg-purple-100 overflow-hidden flex flex-col'>
//       <div className='flex flex-col w-full sm:max-w-[70%] h-full py-5 mx-auto px-4 overflow-hidden'>

//         {/* FIX: Set a precise flex-grow height limit constraint so input section never gets pushed off screen */}
//         <section className='bg-blue-400 w-full flex-1 min-h-0 max-h-[400px] overflow-y-auto rounded-xl p-4 mb-4 shadow-inner'>
//           {messages.map((item) => (
//             <div key={item.id} className={`flex gap-3 ${item.sender === 'bot' ? 'justify-start ' : 'justify-end'} p-2`}>
//               {item.sender === 'user' ? (
//                 <User className='h-10 w-10  text-yellow-500 bg-slate-900 border-none rounded-full order-last' />
//               ) : (
//                 <img src="../myAvatar (2).svg" className='h-10 w-10 bg-slate-900 border-none rounded-full' alt="" />
//               )}
//               <div className={`rounded-lg px-3 py-2 max-w-[80%] ${item.sender === 'bot' ? 'bg-white text-slate-800' : 'bg-indigo-600 text-white'}`}>
//                 {/* Fixed tag layout duplication bug from commented block */}
//                 {item.msg ? (
//                   <div>
//                     <ReactMarkdown>
//                       {item.msg}
//                     </ReactMarkdown>
//                   </div>
//                 ) : (
//                   <p className="whitespace-pre-wrap animate-pulse [animation-duration-2.5]">Thinking...</p>
//                 )}
//                 <span className='text-[10px] block text-right opacity-60 mt-1'>{item.time}</span>
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* Fixed Input Section Wrapper */}
//         <div className='flex w-full items-center border border-slate-700 rounded-2xl bg-white overflow-hidden shadow-md flex-shrink-0'>
//           <textarea
//             className='bg-white flex-1 pl-6 pr-2 py-4 resize-none focus:outline-none text-slate-800 placeholder-slate-400 max-h-32 overflow-y-auto'
//             placeholder='Type a message...'
//             rows={1}
//             name='message'
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <button
//             onClick={questionMessage}
//             className='p-4 text-slate-700 hover:text-indigo-600 transition-colors duration-200'
//           >
//             <ArrowUp size={20} />
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Chat;





// import React, { useState, useEffect } from 'react';
// import { ArrowUp, User } from 'lucide-react';
// import { APIkey } from '../config';
// import ReactMarkdown from 'react-markdown';

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [question, setQuestion] = useState('');

//   // FIXED ID GENERATOR: Uses browser-native ultra-secure crypto UUID strings instead of random Math formulas
//   const addMessage = (msg, sender) => {
//     const id = typeof crypto !== 'undefined' && crypto.randomUUID 
//       ? crypto.randomUUID() 
//       : `${Date.now()}-${Math.random()}`;
      
//     setMessages((prev) => [
//       ...prev,
//       {
//         id,
//         msg,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         sender,
//       },
//     ]);
//     return id;
//   };

//   function questionMessage() {
//     const trimmed = input.trim();
//     if (!trimmed) return;

//     addMessage(trimmed, 'user');
//     setQuestion(trimmed);
//     setInput('');
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       questionMessage();
//     }
//   };

//   useEffect(() => {
//     if (!question) return;

//     const fetchResponse = async () => {
//       // 1. FIXED STATE BUG: We build our payload cleanly using functional state parameters 
//       // instead of relying on stale snapshot pointers from outside the hook scope
//       let apiMessages = [];
      
//       setMessages((currentMessages) => {
//         // Find all messages EXCEPT the one currently being added or processed
//         apiMessages = currentMessages
//           .filter(m => m.msg !== '') 
//           .map((msg) => ({
//             role: msg.sender === 'bot' ? 'assistant' : 'user',
//             content: msg.msg,
//           }));
//         return currentMessages;
//       });

//       // 2. Spawns the clean bot placeholder bubble
//       const botMessageId = addMessage('', 'bot');

//       try {
//         const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${APIkey}`,
//             'Content-Type': 'application/json',
//             'HTTP-Referer': window.location.origin,
//             'X-OpenRouter-Title': 'My Testing App',
//           },
//           body: JSON.stringify({
//             model: 'nvidia/nemotron-3.5-lightning:free',
//             messages: apiMessages, 
//             stream: true, 
//           }),
//         });

//         if (!response.ok) {
//           const errData = await response.json().catch(() => ({}));
//           throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
//         }

//         if (!response.body) throw new Error('No readable response body');

//         const reader = response.body.getReader();
//         const decoder = new TextDecoder('utf-8');
//         let accumulatedText = '';

//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           const chunk = decoder.decode(value, { stream: true });
//           const lines = chunk.split('\n');

//           for (const line of lines) {
//             const cleanedLine = line.trim();
//             if (!cleanedLine || cleanedLine === 'data: [DONE]') continue;

//             if (cleanedLine.startsWith('data: ')) {
//               try {
//                 const parsedJson = JSON.parse(cleanedLine.replace('data: ', ''));
//                 const token = parsedJson?.choices?.[0]?.delta?.content || '';

//                 if (token) {
//                   accumulatedText += token;

//                   setMessages((prev) =>
//                     prev.map((msg) =>
//                       msg.id === botMessageId ? { ...msg, msg: accumulatedText } : msg
//                     )
//                   );
//                 }
//               } catch (e) {
//                 // Skips partial chunk evaluation errors safely
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching AI response:', error);
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.id === botMessageId ? { ...msg, msg: `Error: ${error.message}` } : msg
//           )
//         );
//       } finally {
//         setQuestion('');
//       }
//     };

//     fetchResponse();
//   }, [question]);

//   return (
//     // DARK THEME FIX 1: Main background changed from bright purple to rich slate-dusk 
//     <div className='w-full h-full bg-[#0b0f19] overflow-hidden flex flex-col'>
//       <div className='flex flex-col w-full sm:max-w-[70%] h-full py-5 mx-auto px-4 overflow-hidden'>

//         {/* DARK THEME FIX 2: Replaced the loud bright blue panel box with deep charcoal slate layout */}
//         <section className='bg-[#131c2e] w-full flex-1 min-h-0 max-h-[400px] overflow-y-auto rounded-xl p-4 mb-4 shadow-2xl border border-slate-800/50 shadow-inner'>
//           {messages.map((item) => (
//             <div key={item.id} className={`flex gap-3 ${item.sender === 'bot' ? 'justify-start' : 'justify-end'} p-2`}>
//               {item.sender === 'user' ? (
//                 <User className='h-10 w-10 text-yellow-400 bg-slate-800 border border-slate-700 rounded-full order-last p-1.5' />
//               ) : (
//                 <img src="../myAvatar (2).svg" className='h-10 w-10 bg-slate-800 border border-slate-700 rounded-full' alt="AI Avatar" />
//               )}
              
//               {/* DARK THEME FIX 3: Muted bubble hues to prevent eye straining contrast pops */}
//               <div className={`rounded-lg px-3 py-2 max-w-[80%] shadow-sm ${
//                 item.sender === 'bot' 
//                   ? 'bg-[#1e293b] text-slate-100 border border-slate-700/40' 
//                   : 'bg-indigo-600 text-white'
//               }`}>
//                 {item.msg ? (
//                   <div className="prose prose-invert max-w-none text-sm leading-relaxed">
//                     <ReactMarkdown>
//                       {item.msg}
//                     </ReactMarkdown>
//                   </div>
//                 ) : (
//                   <p className="text-sm font-medium text-slate-400 whitespace-pre-wrap animate-pulse">Thinking...</p>
//                 )}
//                 <span className='text-[10px] block text-right opacity-50 mt-1 font-mono'>{item.time}</span>
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* DARK THEME FIX 4: Input panel wrapped inside clean, border-focused stealth box wrapper */}
//         <div className='flex w-full items-center border border-slate-800 rounded-2xl bg-[#1e293b] overflow-hidden shadow-xl flex-shrink-0 focus-within:border-indigo-500/50 transition-colors duration-200'>
//           <textarea
//             className='bg-transparent flex-1 pl-6 pr-2 py-4 resize-none focus:outline-none text-slate-100 placeholder-slate-500 max-h-32 overflow-y-auto text-sm'
//             placeholder='Type a message...'
//             rows={1}
//             name='message'
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//           <button
//             onClick={questionMessage}
//             className='p-4 text-slate-400 hover:text-indigo-400 transition-colors duration-200'
//           >
//             <ArrowUp size={20} />
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Chat;













import React, {useRef, useState, useEffect } from 'react';
import { ArrowUp, User } from 'lucide-react';
import { APIkey } from '../config';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');

// useref
const handleRef = useRef(null);

  // Generates a unique string ID for tracking state updates
  const addMessage = (msg, sender) => {
    const id = `${Date.now()}-${Math.random()}`;
    setMessages((prev) => [
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
      // 1. FIXED LOGIC: Extract and map message history immediately using the current snapshot
      // This guarantees the messages payload is never empty when sent to OpenRouter
      const apiMessages = messages
        .filter((m) => m.msg !== '') // Exclude any prior placeholder items
        .map((msg) => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.msg,
        }));

      // Explicitly push the active user question to keep history fluid
      apiMessages.push({ role: 'user', content: question });

      // 2. Spawn the empty text holder for streaming feedback
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
            messages: apiMessages, // <-- This now safely contains your structured text history data!
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

                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === botMessageId ? { ...msg, msg: accumulatedText } : msg
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
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, msg: `Error: ${error.message}` } : msg
          )
        );
      } finally {
        setQuestion('');
      }
    };

    fetchResponse();
  }, [question]);



  useEffect(() => {
   handleRef.current?.scrollIntoView({behaviour: "smooth"})
  }, [messages])
  

  return (
    <div className='w-full h-full bg-[#09070f] overflow-hidden flex flex-col'>
      <div className='flex flex-col w-full sm:max-w-[70%] h-full py-5 mx-auto px-4 overflow-hidden scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent hover:scrollbar-thumb-purple-600'>

        {/* Chat window viewport pane container */}
        <section className='bg-[#120e1c] w-full flex-1 min-h-0 max-h-[400px] overflow-y-auto rounded-xl p-4 mb-4 shadow-2xl border border-slate-800/50'>
          {messages.map((item) => (
            <><div key={item.id} className={`flex gap-3 ${item.sender === 'bot' ? 'justify-start' : 'justify-end'} p-2`}>
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
            </div><div ref={handleRef}></div></>
          ))}
        </section>

        {/* Input area element layout wrapper panel */}
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


