


// import React, { useState, useEffect } from 'react';
// import { ArrowUp } from 'lucide-react';
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
//       // 1. Spawns an empty placeholder bot message first
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
//             messages: [{ role: 'user', content: question }],
//             stream: true, // Enables streaming on OpenRouter
//           }),
//         });

//         if (!response.ok) {
//           const errData = await response.json().catch(() => ({}));
//           throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
//         }

//         if (!response.body) throw new Error('No readable response body');

//         // 2. Read incoming browser stream chunks
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
//             <div key={item.id} className={`flex ${item.sender === 'bot' ? 'justify-start' : 'justify-end'} p-2`}>
//               <div className={`rounded-lg px-3 py-2 max-w-[80%] ${item.sender === 'bot' ? 'bg-white text-slate-800' : 'bg-indigo-600 text-white'}`}>
//                 {/* Fixed tag layout duplication bug from commented block */}
//       {item.msg ? (
//   <div>
//     <ReactMarkdown>
//       {item.msg}
//     </ReactMarkdown>
//   </div>
// ) : (
//   <p className="whitespace-pre-wrap">Thinking...</p>
// )}
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




import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { APIkey } from '../config';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');

  // Modified to return a unique ID string to explicitly target during streaming updates
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

  // Handle Enter to submit, Shift+Enter for new line
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      questionMessage();
    }
  };

  useEffect(() => {
    if (!question) return;

    const fetchResponse = async () => {
      // 1. Map existing chat state to OpenAI/OpenRouter format before appending the new placeholder
      // This ensures we capture the conversation history up to this exact moment
      const apiMessages = messages.map((msg) => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.msg,
      }));

      // Append the current active question to the payload history array
      apiMessages.push({ role: 'user', content: question });

      // 2. Spawns an empty placeholder bot message first
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
            model: 'nvidia/nemotron-3.5-lightning:free',
            messages: apiMessages, // <-- CHANGED: Passed the whole history instead of just one question
            stream: true, // Enables streaming on OpenRouter
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
        }

        if (!response.body) throw new Error('No readable response body');

        // 3. Read incoming browser stream chunks
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

                  // Update the exact bot bubble step-by-step
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === botMessageId ? { ...msg, msg: accumulatedText } : msg
                    )
                  );
                }
              } catch (e) {
                // Skips partial chunk evaluation errors
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

  return (
    // FIX: Set explicit h-screen viewport constraints to stop input page overflow
    <div className='w-full h-full bg-purple-100 overflow-hidden flex flex-col'>
      <div className='flex flex-col w-full sm:max-w-[70%] h-full py-5 mx-auto px-4 overflow-hidden'>

        {/* FIX: Set a precise flex-grow height limit constraint so input section never gets pushed off screen */}
        <section className='bg-blue-400 w-full flex-1 min-h-0 max-h-[400px] overflow-y-auto rounded-xl p-4 mb-4 shadow-inner'>
          {messages.map((item) => (
            <div key={item.id} className={`flex ${item.sender === 'bot' ? 'justify-start' : 'justify-end'} p-2`}>
              <div className={`rounded-lg px-3 py-2 max-w-[80%] ${item.sender === 'bot' ? 'bg-white text-slate-800' : 'bg-indigo-600 text-white'}`}>
                {/* Fixed tag layout duplication bug from commented block */}
                {item.msg ? (
                  <div>
                    <ReactMarkdown>
                      {item.msg}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap animate-pulse [animation-duration-2.5]">Thinking...</p>
                )}
                <span className='text-[10px] block text-right opacity-60 mt-1'>{item.time}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Fixed Input Section Wrapper */}
        <div className='flex w-full items-center border border-slate-700 rounded-2xl bg-white overflow-hidden shadow-md flex-shrink-0'>
          <textarea
            className='bg-white flex-1 pl-6 pr-2 py-4 resize-none focus:outline-none text-slate-800 placeholder-slate-400 max-h-32 overflow-y-auto'
            placeholder='Type a message...'
            rows={1}
            name='message'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={questionMessage}
            className='p-4 text-slate-700 hover:text-indigo-600 transition-colors duration-200'
          >
            <ArrowUp size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;



