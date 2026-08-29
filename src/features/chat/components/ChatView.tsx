import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole, UserProfile } from '../../../types/common.types';
import { Avatar } from '../../../components/ui/Avatar';
import { Lightbox } from '../../../components/ui/Lightbox';
import { formatTimeVi } from '../../../utils/dateUtils';
import {
  Send,
  Image as ImageIcon,
  Camera,
  Pin,
  Smile,
  CheckCheck,
  Loader2,
  Sparkles,
  Heart,
} from 'lucide-react';
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

const QUICK_ROMANTIC_EMOJIS = [
  '🥰', '😘', '💖', '🥺', '😆', '❤️', '💋', '🌹',
  '🧋', '🍫', '🐻', '🐰', '💍', '✨', '🌸', '🎉'
];

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Xử lý gửi ảnh từ máy hoặc từ Camera
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setShowEmojiPicker(false);

    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        onSendMessage({ imageUrl: url });
      } else {
        // Fallback base64 nếu upload lỗi
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onSendMessage({ imageUrl: event.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Failed to send image:', error);
    } finally {
      setIsUploading(false);
      // Reset input value để có thể chọn lại cùng 1 file
      e.target.value = '';
    }
  };

  const reactionEmojis = ['❤️', '💋', '🥺', '😆', '😡'];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-14 sm:pb-16 max-w-2xl mx-auto">
      {/* Hidden File Inputs for Device Gallery & Instant Camera */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

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

        <div className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
          <Heart className="w-3 h-3 fill-rose-500" />
          <span>Chỉ 2 đứa mình 💕</span>
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
      <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2">
        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            Chưa có tin nhắn nào. Hãy gửi lời yêu thương đầu tiên nhé! 💕
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === me.id;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 group ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Partner Avatar */}
              {!isMe && (
                <Avatar src={partner.avatar} alt={partner.name} size="sm" />
              )}

              <div className={`relative max-w-[80%] sm:max-w-[70%]`}>
                {/* Bubble Container */}
                <div
                  className={`rounded-2xl p-3 shadow-sm transition-all ${
                    isMe
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {/* Text Message */}
                  {msg.text && (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  )}

                  {/* Image Attachment (Click to Lightbox Zoom) */}
                  {msg.imageUrl && (
                    <div
                      onClick={() => setSelectedPhotoUrl(msg.imageUrl || null)}
                      className="relative rounded-xl overflow-hidden my-1 cursor-pointer bg-slate-900/10 group/photo max-w-[240px]"
                    >
                      <img
                        src={msg.imageUrl}
                        alt="Đã gửi ảnh"
                        className="w-full max-h-56 object-cover group-hover/photo:scale-103 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-rose-300" />
                        <span>Xem ảnh to</span>
                      </div>
                    </div>
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
                    {Object.entries(msg.reactions).map(([emoji]) => (
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
          );
        })}

        {/* Uploading indicator bubble */}
        {isUploading && (
          <div className="flex items-end justify-end gap-2 animate-fade-in">
            <div className="rounded-2xl rounded-br-none p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              <span>Đang tải ảnh từ máy lên...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Romantic Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="glass-panel p-3 rounded-2xl mb-2 border border-rose-200 shadow-xl animate-fade-in">
          <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center justify-between">
            <span>Chọn icon cảm xúc nhanh:</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {QUICK_ROMANTIC_EMOJIS.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-xl hover:scale-125 active:scale-95 transition-transform p-1 rounded-lg hover:bg-rose-50"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar with Direct Device Upload & Instant Camera */}
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-1.5 border border-rose-200/80 shadow-md">
        {/* Nút Chọn Ảnh từ Thư Viện Máy */}
        <button
          onClick={() => galleryInputRef.current?.click()}
          className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          title="Chọn ảnh từ máy"
          disabled={isUploading}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        {/* Nút Chụp Ảnh Ngay Bằng Camera */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="p-2 text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
          title="Chụp ảnh trực tiếp"
          disabled={isUploading}
        >
          <Camera className="w-5 h-5" />
        </button>

        {/* Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-xl transition-colors ${
            showEmojiPicker
              ? 'text-rose-600 bg-rose-100/80'
              : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
          }`}
          title="Biểu tượng cảm xúc"
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

      {/* Lightbox Zoom Photo */}
      <Lightbox
        isOpen={Boolean(selectedPhotoUrl)}
        onClose={() => setSelectedPhotoUrl(null)}
        imageUrl={selectedPhotoUrl}
        caption="Ảnh trong cuộc trò chuyện 💕"
      />
    </div>
  );
};
