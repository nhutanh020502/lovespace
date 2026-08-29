import OneSignal from 'react-onesignal';
import { UserRole } from '../types/common.types';

const ONESIGNAL_APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID || '497cba6f-e415-4cdd-aba4-d11d386e3440';

let isInitialized = false;

/**
 * Khởi tạo OneSignal Web SDK
 */
export async function initOneSignal(): Promise<void> {
  if (isInitialized || typeof window === 'undefined') return;

  if (!ONESIGNAL_APP_ID) {
    console.warn('OneSignal App ID is not configured in .env');
    return;
  }

  try {
    await OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerPath: 'OneSignalSDKWorker.js',
    });

    isInitialized = true;
    console.log('🔔 OneSignal Web SDK initialized successfully!');
  } catch (error) {
    console.warn('OneSignal initialization error:', error);
  }
}

/**
 * Đăng ký Tag vai trò người dùng (để phân biệt Chồng hay Vợ nhận thông báo)
 */
export async function setOneSignalUserRole(role: UserRole): Promise<void> {
  if (!isInitialized) return;
  try {
    await OneSignal.User.addTag('role', role);
    await OneSignal.login(role === 'husband' ? 'user_husband' : 'user_wife');
  } catch (err) {
    console.warn('OneSignal set tag failed:', err);
  }
}

/**
 * Yêu cầu quyền thông báo đẩy (Push Notification Permission)
 */
export async function requestNotificationPermission(): Promise<{ granted: boolean; message: string }> {
  if (typeof window === 'undefined') {
    return { granted: false, message: 'Môi trường không hỗ trợ thông báo.' };
  }

  // 1. Kiểm tra hỗ trợ Notification
  if (!('Notification' in window)) {
    return { granted: false, message: 'Trình duyệt này không hỗ trợ thông báo đẩy.' };
  }

  // 2. Nếu người dùng đã từng bấm "Chặn" (Denied)
  if (Notification.permission === 'denied') {
    return {
      granted: false,
      message: '⚠️ Thông báo đang bị chặn. Vui lòng bấm vào biểu tượng ổ khóa 🔒 trên thanh địa chỉ để Bật Thông Báo!',
    };
  }

  // 3. Nếu đã được cấp quyền từ trước
  if (Notification.permission === 'granted') {
    showSystemNotification('💖 LoveSpace', '🔔 Thông báo đẩy đang hoạt động rất tốt!');
    return {
      granted: true,
      message: '🔔 Thông báo đẩy đang BẬT! Bạn sẽ nhận chuông khi người yêu nhắn tin, thả tim ❤️',
    };
  }

  // 4. Xin quyền thông báo
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showSystemNotification('💖 LoveSpace', 'Đã kích hoạt thông báo đẩy thành công!');
      if (isInitialized) {
        try {
          await OneSignal.Slidedown.promptPush();
        } catch {}
      }
      return {
        granted: true,
        message: '🎉 Đã bật thông báo đẩy thành công!',
      };
    } else {
      return {
        granted: false,
        message: 'Bạn chưa cho phép nhận thông báo.',
      };
    }
  } catch (err) {
    return {
      granted: false,
      message: 'Lỗi khi yêu cầu thông báo: ' + String(err),
    };
  }
}

/**
 * Kiểm tra trạng thái cấp quyền thông báo hiện tại
 */
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'default';
}

/**
 * Bắn thông báo hệ thống (Native OS / Android Status Bar / Windows Banner)
 */
export function showSystemNotification(
  title: string,
  body: string,
  icon: string = '/pwa-192x192.png',
  data?: any
): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      // Ưu tiên bắn qua Service Worker để hiển thị tốt trên Android / Lock Screen
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
          icon,
          data,
        });
      } else {
        new Notification(title, {
          body,
          icon,
          badge: '/pwa-192x192.png',
          tag: 'lovespace_notif_' + Date.now(),
        });
      }
    } catch (err) {
      console.warn('Failed to display native system notification:', err);
    }
  }
}
