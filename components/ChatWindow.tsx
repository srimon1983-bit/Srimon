
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { askQuestion } from '../services/geminiService';
import { ChatMessage, ContractAnalysis } from '../types';

interface Props {
  analysisContext?: ContractAnalysis | null;
}

const ChatWindow: React.FC<Props> = ({ analysisContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askQuestion(input, messages, analysisContext || undefined);
      const aiMessage: ChatMessage = {
        role: 'model',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        role: 'model',
        text: "I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] glass-panel rounded-3xl overflow-hidden shadow-sm border-slate-200 animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Legal AI Assistant</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              {analysisContext ? `Context: ${analysisContext.contractTitle}` : 'General Guidance Mode'}
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Clear Chat History"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <MessageSquare size={32} />
            </div>
            <div className="max-w-xs">
              <h4 className="font-bold text-slate-700">Ask a Question</h4>
              <p className="text-sm text-slate-500 mt-1">
                Query specific terms of your contract, ask for alternative wording, or general legal definitions.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-100 text-slate-800 rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
              }`}>
                <div className="prose prose-sm max-w-none prose-slate">
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{line}</p>
                  ))}
                </div>
                <div className="text-[10px] mt-2 opacity-40 font-bold uppercase tracking-widest text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <Loader2 className="animate-spin text-blue-600" size={20} />
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl rounded-tl-none p-4 w-32 h-10" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t bg-white">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your legal query here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-6 pr-14 py-4 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
          EasyVet AI provides informative context and is not a substitute for legal advice.
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
