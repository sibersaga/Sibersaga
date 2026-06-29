import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Image as ImageIcon, MessageSquare, Loader2, Maximize, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import ReactMarkdown from 'react-markdown';

type TabType = 'chat' | 'image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image';
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya asisten Gemini Sistem SDN 3 Purwosari. Ada yang bisa saya bantu untuk menganalisis konten atau merencanakan pembaruan website ini?',
      type: 'text',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Image Generation States
  const [imagePrompt, setImagePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImages, setGeneratedImages] = useState<{url: string, prompt: string, ratio: string}[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // If not admin, don't render the AI Assistant
  if (!isAdmin) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      type: 'text',
      timestamp: new Date()
    }]);
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          type: 'text',
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Terjadi kesalahan');
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message || 'Gagal terhubung ke Gemini API.'}`,
        type: 'text',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const response = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: imagePrompt,
          aspectRatio: aspectRatio 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.imageUrl) {
        setGeneratedImages(prev => [{
          url: data.imageUrl,
          prompt: imagePrompt,
          ratio: aspectRatio
        }, ...prev]);
        setImagePrompt(''); // Clear prompt on success
      } else {
        throw new Error(data.error || 'Terjadi kesalahan saat generate gambar');
      }
    } catch (error: any) {
      setImageError(error.message || 'Gagal menghubungi Gemini API untuk membuat gambar.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const removeGeneratedImage = (index: number) => {
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-40 bg-gradient-to-r from-indigo-600 to-sky-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Buka Gemini AI Assistant"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
      </button>

      {/* Slide-over Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Bot size={24} className="text-sky-300" />
            </div>
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                Gemini Intelligence
                <span className="px-1.5 py-0.5 bg-indigo-500 text-[9px] rounded uppercase font-black tracking-wider">Beta</span>
              </h2>
              <p className="text-xs text-indigo-200">Asisten khusus Admin</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0 bg-slate-50">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <MessageSquare size={16} />
            Chat & Analisis
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'image' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            <ImageIcon size={16} />
            Generate Gambar
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
          
          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                      <Loader2 size={16} className="text-indigo-500 animate-spin" />
                      <span className="text-xs text-slate-500 font-medium">Gemini sedang berpikir...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tanya Gemini untuk edit web..."
                    disabled={isLoading}
                    className="w-full bg-slate-100 border border-slate-200 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-1.5 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* IMAGE GENERATION TAB */}
          {activeTab === 'image' && (
            <div className="flex-1 overflow-y-auto flex flex-col">
              <div className="p-5 space-y-6">
                <form onSubmit={handleGenerateImage} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Prompt Gambar</label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Contoh: Gedung sekolah modern bergaya arsitektur tropis, dengan taman bermain, resolusi tinggi, photorealistic..."
                      rows={3}
                      className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 resize-none transition-all"
                      disabled={isGeneratingImage}
                    />
                  </div>
                  
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Aspek Rasio</label>
                      <select 
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        disabled={isGeneratingImage}
                        className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                      >
                        <option value="1:1">1:1 (Persegi - Default)</option>
                        <option value="4:3">4:3 (Thumbnail/Landscape Klasik)</option>
                        <option value="3:4">3:4 (Portrait)</option>
                        <option value="16:9">16:9 (Hero Banner/Widescreen)</option>
                        <option value="9:16">9:16 (Story/Mobile Fullscreen)</option>
                        <option value="3:2">3:2 (Fotografi)</option>
                        <option value="2:3">2:3 (Poster)</option>
                        <option value="21:9">21:9 (Ultrawide)</option>
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!imagePrompt.trim() || isGeneratingImage}
                      className="px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 disabled:bg-slate-300 disabled:text-slate-500 transition-colors flex items-center gap-2"
                    >
                      {isGeneratingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                      {isGeneratingImage ? 'Membuat...' : 'Buat'}
                    </button>
                  </div>

                  {imageError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-700 font-medium leading-relaxed">{imageError}</p>
                    </div>
                  )}
                </form>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">Hasil Gambar</h3>
                  
                  {generatedImages.length === 0 ? (
                    <div className="text-center py-10 px-4 bg-white border border-slate-200 border-dashed rounded-2xl">
                      <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm text-slate-500">Belum ada gambar yang dibuat.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {generatedImages.map((img, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                          <div className="relative bg-slate-100 flex items-center justify-center p-2">
                            <img 
                              src={img.url} 
                              alt={img.prompt} 
                              className="max-w-full max-h-[300px] object-contain rounded-xl"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <a 
                                href={img.url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg shadow hover:bg-white hover:text-sky-600"
                                title="Buka Gambar Resolusi Penuh"
                              >
                                <Maximize size={16} />
                              </a>
                              <button 
                                onClick={() => removeGeneratedImage(idx)}
                                className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg shadow hover:bg-red-50 hover:text-red-600"
                                title="Hapus Gambar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs text-slate-600 font-medium leading-relaxed italic line-clamp-3">"{img.prompt}"</p>
                              <span className="shrink-0 px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">
                                {img.ratio}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop for mobile (optional) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 sm:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
