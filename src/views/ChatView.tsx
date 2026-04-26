import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Eraser } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';
import { chatWithAI } from '../services/geminiService';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { cn } from '../lib/utils';

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('MMPCRAFTER_CHAT_HISTORY');
    return saved ? JSON.parse(saved) : [
      { role: 'model', content: 'Hello! I am MMPCRAFTER AI. How can I help you with Minecraft today? စကားပြောဖို့ အဆင်သင့်ရှိနေပါပြီ။' }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('MMPCRAFTER_CHAT_HISTORY', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input } as Message;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAI([...messages, userMessage]);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'မြန်မာ: တောင်းပန်ပါတယ်၊ အမှားတစ်ခုရှိနေပါတယ်။ (Error communicating with AI)' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-h-[80vh]">
      <div className="lg:col-span-1 space-y-4 hidden lg:block">
        <PixelCard title="Quick Tips">
          <ul className="text-xs space-y-2 text-slate-400">
            <li className="p-3 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 shadow-sm rounded-xl cursor-pointer transition-all" onClick={() => setInput("How to build a basic redstone farm?")}>
              • Basic Redstone
            </li>
            <li className="p-3 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 shadow-sm rounded-xl cursor-pointer transition-all" onClick={() => setInput("Explain command blocks in Burmese.")}>
              • Command Blocks (MM)
            </li>
            <li className="p-3 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 shadow-sm rounded-xl cursor-pointer transition-all" onClick={() => setInput("List top 5 shaders for low end PC.")}>
              • Optimization
            </li>
            <li className="p-3 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 shadow-sm rounded-xl cursor-pointer transition-all" onClick={() => setInput("Best server hosting tips.")}>
              • Server Hosting
            </li>
          </ul>
        </PixelCard>
        <PixelButton 
          variant="danger" 
          className="w-full text-xs" 
          onClick={() => setMessages([{ role: 'model', content: 'Chat history cleared. မင်္ဂလာပါ၊ ဘာကူညီပေးရမလဲ။' }])}
        >
          <div className="flex items-center justify-center gap-2">
            <Eraser size={14} /> Clear Chat
          </div>
        </PixelButton>
      </div>

      <div className="lg:col-span-3 flex flex-col h-[70vh] md:h-[80vh] rounded-3xl overflow-hidden glass shadow-2xl border border-slate-800">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 animate-pulse rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">AI Assistant Terminal</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (confirm("Clear all chat history?")) {
                  setMessages([{ role: 'model', content: 'Chat history cleared. မင်္ဂလာပါ၊ ဘာကူညီပေးရမလဲ။' }]);
                }
              }}
              className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
              title="Clear History"
            >
              <Eraser size={16} />
            </button>
            <div className="flex gap-1.5 font-bold text-slate-700">
              <span className="text-[10px]">Active</span>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-slate-950/20" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-bold text-slate-900 border border-black/10",
                  msg.role === 'user' ? "bg-blue-500 text-white" : "bg-emerald-500"
                )}>
                  {msg.role === 'user' ? "U" : "AI"}
                </div>
                <div className={cn(
                  "p-4 shadow-sm border text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-2xl rounded-tr-none border-blue-500 shadow-blue-500/10" 
                    : "bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none border-slate-700"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 font-bold animate-pulse">
                AI
              </div>
              <div className="p-4 bg-slate-800 rounded-2xl rounded-tl-none border border-slate-700 animate-pulse text-slate-500 text-sm italic">
                Writing response...
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/80 border-t border-slate-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ဒီမှာ မေးခွန်းရေးပါ... (Type here in Burmese or English)"
              className="w-full bg-slate-950 border border-slate-700 rounded-full py-4 px-6 pr-14 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm text-slate-200"
              id="chat-input"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-900 rounded-full transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
