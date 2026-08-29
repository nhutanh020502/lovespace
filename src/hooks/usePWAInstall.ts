import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra nếu đang chạy trong App Native (Capacitor Android / iOS)
    const isNative = Capacitor.isNativePlatform();

    // 2. Kiểm tra nếu app đang chạy ở chế độ Standalone PWA (đã cài đặt vào màn hình chính)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    // 3. Kiểm tra Android WebView
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAndroidWebView = /wv|capacitor/i.test(userAgent);

    const isRunningAsApp = isNative || isStandalone || isAndroidWebView;
    setIsInstalled(isRunningAsApp);

    // 4. Kiểm tra có phải iOS không (iPhone / iPad)
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 5. Lắng nghe sự kiện beforeinstallprompt của Chromium (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async (): Promise<{ outcome: 'accepted' | 'dismissed' | 'ios' | 'unsupported' }> => {
    if (isInstalled) {
      return { outcome: 'accepted' };
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return choice;
    }

    if (isIOS) {
      return { outcome: 'ios' };
    }

    return { outcome: 'unsupported' };
  };

  return {
    canInstall: !isInstalled && (Boolean(deferredPrompt) || isIOS),
    isInstalled,
    isIOS,
    triggerInstall,
  };
}
