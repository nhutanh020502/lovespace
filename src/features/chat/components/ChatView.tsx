import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole, UserProfile } from '../../../types/common.types';
import { Avatar } from '../../../components/ui/Avatar';
import { formatTimeVi } from '../../../utils/dateUtils';
import { Send, Image as ImageIcon, Pin, Heart, Sparkles, Smile, CheckCheck } from 'lucide-react';
import { PRESET_MEMES } from '../../../constants/initialMockData';
import { uploadImageToCloudinary } from '../../../services/cloudinaryService';

interface ChatViewProps {
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (msg: { text?: string; imageUrl?: string; stickerUrl?: string }) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onTogglePin: (messageId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentRole,
  partner1,
  partner2,
  messages,
  onSendMessage,
  onAddReaction,
  onTogglePin,
}) => {
  const me = currentRole === 'husband' ? partner1 : partner2;
  const partner = currentRole === 'husband' ? partner2 : partner1;

  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pinnedMessage = messages.find((m) => m.isPinned);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage({ text: inputText.trim() });
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageToCloudinary(file);
        onSendMessage({ imageUrl: url });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const reactionEmojis = ['❤️', '💋', '🥺', '😆', '😡'];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-14 sm:pb-16 max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="glass-panel p-3 rounded-2xl flex items-center justify-between mb-2 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Avatar src={partner.avatar} alt={partner.name} size="sm" isOnline={partner.isOnline} />
          <div>
            <h3 className="text-xs font-bold text-slate-800">{partner.name}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đang hoạt động cùng bạn
            </span>
          </div>
        </div>

        <div className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
          Chỉ 2 đứa mình 💕
        </div>
      </div>

      {/* Pinned Message Bar (if any) */}
      {pinnedMessage && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-rose-100/80 backdrop-blur-sm rounded-xl border border-rose-200 text-xs text-rose-800 mb-2 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-rose-600 shrink-0 fill-rose-600" />
            <span className="truncate font-medium">Ghim: {pinnedMessage.text || 'Ảnh kỷ niệm'}</span>
          </div>
          <button
            onClick={() => onTogglePin(pinnedMessage.id)}
            className="text-[10px] font-bold text-rose-600 hover:text-rose-800 shrink-0 ml-2"
          >
            Bỏ ghim
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 space-y-3 py-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === me.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
            >
              <div className="flex items-end gap-1.5 max-w-[82%] sm:max-w-[75%]">
                {!isMe && (
                  <Avatar src={partner.avatar} alt={partner.name} size="sm" className="mb-1" />
                )}

                <div className="relative">
                  {/* Bubble Container */}
                  <div
                    className={`rounded-2xl p-3 shadow-sm transition-all ${
                      isMe
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-100'
                    }`}
                  >
                    {/* Text */}
                    {msg.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.text}
                      </p>
                    )}

                    {/* Image */}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Photo"
                        className="rounded-xl max-h-56 w-auto object-cover mt-1 border border-white/20"
                      />
                    )}

                    {/* Sticker/Meme */}
                    {msg.stickerUrl && (
                      <img
                        src={msg.stickerUrl}
                        alt="Sticker"
                        className="w-28 h-28 object-contain my-1"
                      />
                    )}

                    {/* Time & Read Status */}
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                        isMe ? 'text-rose-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{formatTimeVi(msg.createdAt)}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>

                  {/* Reaction Pill Overlay */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="absolute -bottom-2.5 right-2 flex items-center bg-white shadow-md border border-rose-100 rounded-full px-1.5 py-0.5 text-[11px]">
                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                        <span key={emoji} className="mx-0.5">{emoji}</span>
                      ))}
                    </div>
                  )}

                  {/* Hover Reaction Toolbar */}
                  <div
                    className={`absolute -top-7 ${
                      isMe ? 'right-0' : 'left-0'
                    } hidden group-hover:flex items-center bg-white/95 backdrop-blur-md shadow-md border border-slate-200 rounded-full px-2 py-0.5 gap-1 z-10`}
                  >
                    {reactionEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onAddReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-transform text-xs"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={() => onTogglePin(msg.id)}
                      className="text-slate-400 hover:text-rose-500 pl-1 border-l border-slate-200"
                      title="Ghim tin nhắn"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticker/Meme Picker Popup */}
      {showStickerPicker && (
        <div className="glass-panel p-2.5 rounded-2xl mb-2 border border-rose-200 shadow-lg grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
          {PRESET_MEMES.map((meme) => (
            <img
              key={meme.id}
              src={meme.url}
              alt={meme.title}
              onClick={() => {
                onSendMessage({ stickerUrl: meme.url });
                setShowStickerPicker(false);
              }}
              className="w-full h-16 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform border border-white"
            />
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 border border-rose-200/80 shadow-md">
        {/* Upload Image */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          title="Gửi ảnh"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Meme/Sticker Button */}
        <button
          onClick={() => setShowStickerPicker(!showStickerPicker)}
          className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          title="Gửi meme/sticker"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhắn lời yêu thương..."
          className="flex-1 bg-white/90 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white disabled:opacity-40 disabled:pointer-events-none hover:shadow-md hover:shadow-rose-200 active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
