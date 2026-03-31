
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Cpu, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { SHOPS_DATA } from '../data/shops';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { translations, Language } from '../data/translations';
import { Modality } from "@google/genai";

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatBotProps {
  lang: Language;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideToggle?: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ lang, isOpen: externalIsOpen, onOpenChange, hideToggle }) => {
  const t = translations[lang];
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      { role: 'bot', content: t.aiGreeting }
    ]);
  }, [lang]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // Context about the shops
      const shopsContext = SHOPS_DATA.map(s => `${s.name} in ${s.district} at ${s.address}`).join('\n');

      const prompt = `
        You are the SpareGrid AI Assistant. Your goal is to help users find automotive spare parts and shops in the Coimbatore-Salem corridor (Coimbatore, Tiruppur, Erode, Gobi, Salem).
        
        Available Shops Context:
        ${shopsContext}
        
        User Query: "${userMessage}"
        
        Instructions:
        1. Be direct, technical, and helpful.
        2. If the user asks for a shop, recommend one from the context if it matches their location.
        3. If the user asks about a part, give technical advice and suggest where they might find it.
        4. Keep responses concise and formatted with markdown if needed.
        5. If you don't know something, be honest but try to guide them to a general category of shop.
        6. Respond in ${lang === 'TA' ? 'Tamil' : 'English'}.
      `;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const botResponse = result.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);

      // Voice Output
      try {
        setIsSpeaking(true);
        const voiceResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: botResponse.slice(0, 300) }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: lang === 'TA' ? 'Fenrir' : 'Kore' },
              },
            },
          },
        });
        const base64Audio = voiceResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
          audio.play();
          audio.onended = () => setIsSpeaking(false);
        } else {
          setIsSpeaking(false);
        }
      } catch (vErr) {
        console.error("Voice Error:", vErr);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("ChatBot Error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm having trouble connecting to my brain. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      {!hideToggle && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-5 right-16 md:top-auto md:bottom-8 w-10 h-10 md:w-14 md:h-14 bg-brand-orange rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,77,0,0.4)] hover:scale-110 transition-transform z-[100]"
        >
          {isOpen ? <X size={20} className="md:w-6 md:h-6" /> : <MessageSquare size={20} className="md:w-6 md:h-6" />}
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-2 md:inset-auto md:bottom-24 md:right-8 md:w-[380px] md:h-[500px] bg-brand-charcoal border border-white/10 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-[150] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 bg-brand-orange/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center">
                  <Bot size={20} className={isSpeaking ? 'animate-bounce' : ''} />
                </div>
                <div>
                  <div className="text-sm font-bold italic">{t.aiAssistant}</div>
                  <div className="text-[10px] text-brand-orange font-bold uppercase tracking-widest flex items-center gap-1">
                    <Cpu size={8} className={isSpeaking ? 'animate-pulse' : ''} /> {isSpeaking ? 'Speaking...' : t.online}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-brand-orange/20'}`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} className="text-brand-orange" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-brand-orange text-white rounded-tr-none' : 'bg-white/5 text-white/80 rounded-tl-none'}`}>
                      <div className="markdown-body prose prose-invert prose-xs max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 items-center bg-white/5 p-3 rounded-2xl rounded-tl-none">
                    <Loader2 size={14} className="animate-spin text-brand-orange" />
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.thinking}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative group">
                <div className="absolute -inset-[1px] -z-10 overflow-hidden rounded-[calc(0.75rem+1.5px)] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-[1px]">
                  <div className="absolute inset-[-500%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#FF4D00_360deg)]" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.askAi}
                  className="w-full bg-brand-charcoal border border-white/10 rounded-xl py-3 px-4 pr-12 text-xs focus:outline-none focus:border-brand-orange transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
