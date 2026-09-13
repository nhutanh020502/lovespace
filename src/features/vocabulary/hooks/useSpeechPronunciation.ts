import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechPronunciationReturn {
  speak: (text: string, lang?: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useSpeechPronunciation(): UseSpeechPronunciationReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Ưu tiên chọn giọng đọc chuẩn US hoặc GB chất lượng cao
        const preferredVoice =
          voices.find(
            (v) =>
              (v.lang === 'en-US' || v.lang === 'en_US') &&
              (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
          ) ||
          voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US') ||
          voices.find((v) => v.lang.startsWith('en')) ||
          null;

        voiceRef.current = preferredVoice;
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, lang: string = 'en-US') => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Web Speech API không được hỗ trợ trên trình duyệt này.');
        return;
      }

      // Hủy mọi âm thanh đang đọc dở
      window.speechSynthesis.cancel();

      if (!text.trim()) return;

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = lang;
      utterance.rate = 0.88; // Tốc độ vừa phải, rõ từng âm vị cho người học
      utterance.pitch = 1.0;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn('Lỗi phát âm SpeechSynthesis:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  return { speak, stop, isSpeaking, isSupported };
}
