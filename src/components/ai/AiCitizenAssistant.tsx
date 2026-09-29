import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { askCitizenAssistant } from '../../services/aiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiCitizenAssistant: React.FC = () => {
  const { 
    isAiAssistantOpen, 
    setIsAiAssistantOpen, 
    language, 
    currentUser, 
    setActiveServiceForWizard, 
    setCurrentView,
    services 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I am your GovFlow AI Citizen Assistant.\n\nI can help you:\n• Find the right certificate for your specific purpose (scholarship, higher education, quota, jobs)\n• Check mandatory document criteria\n• Understand why a correction was requested and how to resubmit\n• Guide you step-by-step through form fields`,
      timestamp: 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAiAssistantOpen]);

  if (!isAiAssistantOpen) return null;

  const quickPrompts = [
    'I need a certificate for a college scholarship',
    'What documents are needed for Income Certificate?',
    'Why was my document flagged for correction?',
    'What is the difference between Domicile and Residence Certificate?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askCitizenAssistant(query, language, currentUser.role);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Based on your request regarding "${query}":\n\n• For scholarships: An Income Certificate issued by the Revenue Sub-Division is required.\n• Required proofs: Masked Identity ID, Recent Electricity Bill, and 3-month salary statement or Talati inquiry.\n\nDisclaimer: AI-generated guidance is for assistance only. Verify requirements with the relevant official authority.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
      
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-none">AI Citizen Assistant</h3>
            <span className="text-[10px] text-slate-400 mt-0.5 inline-block">
              Guidance & Document Clarification
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAiAssistantOpen(false)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong> AI-generated guidance is for assistance only. It does not constitute official legal advice or departmental approval.
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/60'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-mono px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Bot className="w-4 h-4 animate-bounce text-indigo-600" />
            <span>Analyzing service criteria...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2 border-t border-slate-200 bg-slate-50 text-[11px] space-y-1.5">
        <span className="text-slate-400 font-medium px-2 block">Quick assistance prompts:</span>
        <div className="flex flex-wrap gap-1">
          {quickPrompts.slice(0, 2).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-left px-2 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded text-[11px] transition-colors truncate max-w-full"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about required documents, status..."
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
