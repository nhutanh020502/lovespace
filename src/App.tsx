import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudio } from './hooks/useAudio';
import { useHaptic } from './hooks/useHaptic';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav, TabType } from './components/layout/BottomNav';
import { SettingsModal } from './components/layout/SettingsModal';
import { DashboardView } from './features/dashboard/components/DashboardView';
import { HealthCareView } from './features/health-care/components/HealthCareView';
import { ChatView } from './features/chat/components/ChatView';
import { PlacesView } from './features/places-food/components/PlacesView';
import { MemoryGalleryView } from './features/gallery/components/MemoryGalleryView';
import { AuthAndPairingView } from './features/auth/components/AuthAndPairingView';
import { PWAInstallBanner } from './components/ui/PWAInstallBanner';
import { RomanticAuroraBackground } from './components/ui/RomanticAuroraBackground';
import { ParticleHeartTrail } from './components/ui/ParticleHeartTrail';
import {
  INITIAL_SETTINGS,
  INITIAL_MOODS,
  INITIAL_HEALTH,
  INITIAL_MESSAGES,
  INITIAL_MEMORIES,
  INITIAL_PLACES,
  INITIAL_TODOS,
} from './constants/initialMockData';
import {
  UserRole,
  MoodStatus,
  HealthStatus,
  ChatMessage,
  MemoryPhoto,
  PlaceFoodItem,
  TodoItem,
  CustomInteraction,
} from './types/common.types';
import { triggerLoveConfetti, triggerCelebration } from './components/ui/ConfettiEffect';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import {
  fetchMoodStatuses,
  upsertMoodStatus,
  fetchHealthStatuses,
  upsertHealthStatus,
  fetchChatMessages,
  insertChatMessage,
  updateChatMessage,
  fetchPlaces,
  insertPlace,
  updatePlace,
  togglePlaceVisited,
  deletePlace as deletePlaceSync,
  fetchTodos,
  insertTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo as deleteTodoSync,
  fetchMemories,
  insertMemory,
  updateMemory,
  deleteMemory as deleteMemorySync,
  broadcastCoupleAction,
  setActiveRealtimeChannel,
} from './services/supabaseSync';
import { initOneSignal, setOneSignalUserRole, showSystemNotification } from './services/notificationService';

export interface AuthSession {
  phone: string;
  name: string;
  role: UserRole;
  coupleId: string;
  partnerName: string;
  partnerPhone?: string;
  anniversaryDate?: string;
}

export function App() {
  // Global State stored in LocalStorage (Local-First)
  const [authSession, setAuthSession] = useLocalStorage<AuthSession | null>('lovespace_auth_session', null);
  const [settings, setSettings] = useLocalStorage('lovespace_settings', INITIAL_SETTINGS);
  const [moods, setMoods] = useLocalStorage('lovespace_moods', INITIAL_MOODS);
  const [healthData, setHealthData] = useLocalStorage('lovespace_health', INITIAL_HEALTH);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('lovespace_messages', INITIAL_MESSAGES);
  const [memories, setMemories] = useLocalStorage<MemoryPhoto[]>('lovespace_memories', INITIAL_MEMORIES);
  const [places, setPlaces] = useLocalStorage<PlaceFoodItem[]>('lovespace_places', INITIAL_PLACES);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('lovespace_todos', INITIAL_TODOS);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Interactive Sound & Haptic
  const audio = useAudio(settings.soundEnabled);
  const haptic = useHaptic(settings.hapticEnabled);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const me = settings.currentActiveUser === 'husband' ? settings.partner1 : settings.partner2;
  const partner = settings.currentActiveUser === 'husband' ? settings.partner2 : settings.partner1;

  // Khởi tạo OneSignal Push Notification
  React.useEffect(() => {
    initOneSignal().then(() => {
      setOneSignalUserRole(settings.currentActiveUser);
    });
  }, [settings.currentActiveUser]);

  // 1. Tải dữ liệu ban đầu từ Supabase (nếu có cấu hình)
  React.useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const loadCloudData = async () => {
      try {
        const [cloudMoods, cloudHealth, cloudMsgs, cloudPlaces, cloudTodos, cloudMems] = await Promise.all([
          fetchMoodStatuses(),
          fetchHealthStatuses(),
          fetchChatMessages(),
          fetchPlaces(),
          fetchTodos(),
          fetchMemories(),
        ]);

        if (cloudMoods) setMoods(cloudMoods);
        if (cloudHealth) setHealthData(cloudHealth);
        if (cloudMsgs && cloudMsgs.length > 0) setMessages(cloudMsgs);
        if (cloudPlaces && cloudPlaces.length > 0) setPlaces(cloudPlaces);
        if (cloudTodos && cloudTodos.length > 0) setTodos(cloudTodos);
        if (cloudMems && cloudMems.length > 0) setMemories(cloudMems);
      } catch (err) {
        console.warn('Lỗi khi tải dữ liệu từ Supabase:', err);
      }
    };

    loadCloudData();

    // 2. Lắng nghe thay đổi Realtime từ Supabase (WebSockets)
    const channel = supabase.channel('lovespace_realtime_channel', {
      config: {
        broadcast: { self: false },
      },
    });

    setActiveRealtimeChannel(channel);

    channel
      // Lắng nghe tương tác tức thì (Thả tim, Hôn, Nhắc nước, Ôm, Nhắc thuốc)
      .on('broadcast', { event: 'couple_interaction' }, ({ payload }) => {
        if (payload.senderRole === settings.currentActiveUser) return;

        if (payload.type === 'heart') {
          triggerLoveConfetti();
          audio.playKiss();
          haptic.heartbeat();
          showToast(`${payload.senderName} vừa gửi cho bạn một triệu trái tim! ❤️`);
          showSystemNotification('❤️ Trái Tim Yêu Thương', `${payload.senderName} vừa gửi cho bạn một triệu trái tim!`);
        } else if (payload.type === 'kiss') {
          triggerLoveConfetti();
          audio.playKiss();
          haptic.heartbeat();
          showToast(`${payload.senderName} vừa gửi nụ hôn ngọt ngào "Chụt"! 💋`);
          showSystemNotification('💋 Nụ Hôn Ngọt Ngào', `${payload.senderName} vừa gửi cho bạn nụ hôn "Chụt"!`);
        } else if (payload.type === 'water') {
          audio.playReminder();
          haptic.medium();
          showToast(`${payload.senderName} nhắc bạn nhớ uống nước ấm nhé! 🥛`);
          showSystemNotification('🥛 Nhắc Uống Nước', `${payload.senderName} nhắc bạn nhớ uống nước ấm nhé!`);
        } else if (payload.type === 'hug') {
          audio.playKiss();
          haptic.medium();
          showToast(`${payload.senderName} vừa gửi cho bạn một cái ôm ấm áp! 🫂`);
          showSystemNotification('🫂 Cái Ôm Ấm Áp', `${payload.senderName} vừa gửi cho bạn một cái ôm thật chặt!`);
        } else if (payload.type === 'medicine') {
          audio.playReminder();
          haptic.medium();
          showToast(`${payload.senderName} nhắc bạn nhớ uống "${payload.detail}"! 💊`);
          showSystemNotification('💊 Nhắc Uống Thuốc', `${payload.senderName} nhắc bạn nhớ uống thuốc "${payload.detail}"!`);
        } else if (payload.type === 'todo_completed') {
          triggerCelebration();
          audio.playCelebrate();
          haptic.heartbeat();
          showToast(`${payload.senderName} vừa hoàn thành: "${payload.detail}"! 🎉`);
          showSystemNotification('🎉 Hoàn Thành Việc Chung', `${payload.senderName} vừa hoàn thành: "${payload.detail}"!`);
        }
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mood_status' },
        (payload: any) => {
          if (payload.new && payload.new.user_id) {
            const newMood: MoodStatus = {
              userId: payload.new.user_id,
              mood: payload.new.mood,
              caption: payload.new.caption,
              photoUrl: payload.new.photo_url,
              isCustomPhoto: payload.new.is_custom_photo,
              updatedAt: payload.new.updated_at,
            };
            setMoods((prev) => ({
              ...prev,
              [payload.new.user_id]: newMood,
            }));
            const myPartnerId = settings.currentActiveUser === 'husband' ? settings.partner2.id : settings.partner1.id;
            if (payload.new.user_id === myPartnerId) {
              audio.playPop();
              showToast(`${partner.nickname} vừa cập nhật tâm trạng mới! ✨`);
              showSystemNotification(`✨ ${partner.nickname} Đổi Tâm Trạng`, `"${newMood.caption || 'Cảm xúc mới'}"`);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'health_care' },
        (payload: any) => {
          if (payload.new && payload.new.user_id) {
            setHealthData((prev) => ({
              ...prev,
              [payload.new.user_id]: {
                userId: payload.new.user_id,
                illnessName: payload.new.illness_name,
                symptoms: payload.new.symptoms,
                severity: payload.new.severity,
                medicines: payload.new.medicines || [],
                allergies: payload.new.allergies || [],
                dislikedFoods: payload.new.disliked_foods || [],
                favoriteComfortFoods: payload.new.favorite_comfort_foods || [],
                periodTracking: payload.new.period_tracking,
                lastUpdated: payload.new.last_updated,
              },
            }));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload: any) => {
          const newMsg: ChatMessage = {
            id: payload.new.id,
            senderId: payload.new.sender_id,
            text: payload.new.text,
            imageUrl: payload.new.image_url,
            stickerUrl: payload.new.sticker_url,
            reactions: payload.new.reactions || {},
            isPinned: payload.new.is_pinned,
            status: payload.new.status,
            createdAt: payload.new.created_at,
          };
          setMessages((prev) => {
            // 1. Kiểm tra nếu đã có tin nhắn cùng ID -> bỏ qua
            if (prev.some((m) => m.id === newMsg.id)) return prev;

            // 2. Kiểm tra nếu là tin nhắn optimistic do chính mình vừa gửi (cùng sender, nội dung và thời gian sát nhau) -> thay thế ID chính xác
            const matchIdx = prev.findIndex(
              (m) =>
                m.senderId === newMsg.senderId &&
                (m.text || '') === (newMsg.text || '') &&
                (m.imageUrl || '') === (newMsg.imageUrl || '') &&
                (m.stickerUrl || '') === (newMsg.stickerUrl || '') &&
                Math.abs(new Date(m.createdAt).getTime() - new Date(newMsg.createdAt).getTime()) < 8000
            );

            if (matchIdx !== -1) {
              const updated = [...prev];
              updated[matchIdx] = newMsg;
              return updated;
            }

            // 3. Tin nhắn mới từ đối phương -> thêm vào danh sách, phát âm thanh & bắn thông báo hệ thống
            if (newMsg.senderId !== me.id) {
              audio.playPop();
              haptic.light();
              showSystemNotification(
                `💬 ${partner.nickname}`,
                newMsg.text || (newMsg.imageUrl ? '📷 Đã gửi một hình ảnh' : '✨ Đã gửi sticker')
              );
            }
            return [...prev, newMsg];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_messages' },
        (payload: any) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === payload.new.id
                ? {
                    ...m,
                    reactions: payload.new.reactions || {},
                    isPinned: payload.new.is_pinned,
                  }
                : m
            )
          );
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'places_food' },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newPlace: PlaceFoodItem = {
              id: payload.new.id,
              name: payload.new.name,
              category: payload.new.category,
              address: payload.new.address,
              googleMapsUrl: payload.new.google_maps_url,
              estimatedPrice: payload.new.estimated_price,
              mustTryDishes: payload.new.must_try_dishes,
              notes: payload.new.notes,
              rating: payload.new.rating,
              isVisited: payload.new.is_visited,
              addedBy: payload.new.added_by,
              createdAt: payload.new.created_at,
            };
            setPlaces((prev) => (prev.some((p) => p.id === newPlace.id) ? prev : [newPlace, ...prev]));
            if (newPlace.addedBy !== me.id) {
              showToast(`${partner.nickname} vừa thêm điểm hẹn hò mới: "${newPlace.name}"! 🍽️`);
              showSystemNotification(
                '🍽️ Điểm Hẹn Hò Mới',
                `${partner.nickname} vừa thêm quán "${newPlace.name}" (${newPlace.category}) vào danh sách!`
              );
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setPlaces((prev) =>
              prev.map((p) =>
                p.id === payload.new.id ? { ...p, isVisited: payload.new.is_visited, rating: payload.new.rating } : p
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setPlaces((prev) => prev.filter((p) => p.id !== payload.old.id));
          } else {
            fetchPlaces().then((data) => data && setPlaces(data));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shared_todos' },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newTodo: TodoItem = {
              id: payload.new.id,
              title: payload.new.title,
              category: payload.new.category,
              assignedTo: payload.new.assigned_to,
              dueDate: payload.new.due_date,
              isCompleted: payload.new.is_completed,
              completedAt: payload.new.completed_at,
              completedBy: payload.new.completed_by,
              createdAt: payload.new.created_at,
            };
            setTodos((prev) => (prev.some((t) => t.id === newTodo.id) ? prev : [newTodo, ...prev]));
            showToast(`${partner.nickname} vừa thêm việc mới: "${newTodo.title}"! 📝`);
            showSystemNotification(
              '📝 Việc Cần Làm Mới',
              `${partner.nickname} vừa thêm việc: "${newTodo.title}"`
            );
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setTodos((prev) =>
              prev.map((t) =>
                t.id === payload.new.id
                  ? {
                      ...t,
                      isCompleted: payload.new.is_completed,
                      completedAt: payload.new.completed_at,
                      completedBy: payload.new.completed_by,
                    }
                  : t
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setTodos((prev) => prev.filter((t) => t.id !== payload.old.id));
          } else {
            fetchTodos().then((data) => data && setTodos(data));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'memory_gallery' },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newMem: MemoryPhoto = {
              id: payload.new.id,
              photoUrl: payload.new.photo_url,
              date: payload.new.date,
              note: payload.new.note,
              location: payload.new.location,
              tags: payload.new.tags || [],
              uploadedBy: payload.new.uploaded_by,
              createdAt: payload.new.created_at,
            };
            setMemories((prev) => (prev.some((m) => m.id === newMem.id) ? prev : [newMem, ...prev]));
            if (newMem.uploadedBy !== me.id) {
              triggerLoveConfetti();
              audio.playCelebrate();
              showToast(`${partner.nickname} vừa lưu khoảnh khắc kỷ niệm mới! 📸✨`);
              showSystemNotification(
                '📸 Kỷ Niệm Mới',
                `${partner.nickname} vừa lưu: "${newMem.note}"`
              );
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setMemories((prev) => prev.filter((m) => m.id !== payload.old.id));
          } else {
            fetchMemories().then((data) => data && setMemories(data));
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
      setActiveRealtimeChannel(null);
    };
  }, [settings.currentActiveUser]);

  // Đổi vai người dùng (Chồng <-> Vợ)
  const handleSwitchRole = (newRole: UserRole) => {
    setSettings((prev) => ({ ...prev, currentActiveUser: newRole }));
    audio.playPop();
    haptic.light();
    showToast(`Đã chuyển vai sang: ${newRole === 'husband' ? 'Anh Chồng 🐻' : 'Vợ Yêu 🐰'}`);
  };

  // Cập nhật Mood
  const handleUpdateMood = (userId: string, updated: Partial<MoodStatus>) => {
    const updatedStatus: MoodStatus = {
      ...moods[userId],
      ...updated,
      userId,
      updatedAt: new Date().toISOString(),
    };
    setMoods((prev) => ({
      ...prev,
      [userId]: updatedStatus,
    }));
    audio.playPop();
    haptic.medium();
    showToast('Đã cập nhật trạng thái cảm xúc mới! ✨');
    upsertMoodStatus(updatedStatus);
  };

  // Tương tác nhanh (Poke, Kiss, Water, Hug)
  const handlePokeHeart = () => {
    audio.playKiss();
    haptic.heartbeat();
    triggerLoveConfetti();
    showToast('Đã gửi một triệu trái tim đến người yêu! ❤️');
    broadcastCoupleAction({
      type: 'heart',
      senderRole: settings.currentActiveUser,
      senderName: me.nickname,
    });
  };

  const handleSendKiss = () => {
    audio.playKiss();
    haptic.heartbeat();
    showToast('Đã gửi nụ hôn ngọt ngào "Chụt" 💋');
    broadcastCoupleAction({
      type: 'kiss',
      senderRole: settings.currentActiveUser,
      senderName: me.nickname,
    });
  };

  const handleRemindWater = () => {
    audio.playReminder();
    haptic.medium();
    showToast('Đã ting ting nhắc người yêu uống nước rồi nhé! 🥛');
    broadcastCoupleAction({
      type: 'water',
      senderRole: settings.currentActiveUser,
      senderName: me.nickname,
    });
  };

  const handleSendHug = () => {
    audio.playKiss();
    haptic.medium();
    showToast('Đã gửi cái ôm ấm áp vỗ về người yêu 🫂');
    broadcastCoupleAction({
      type: 'hug',
      senderRole: settings.currentActiveUser,
      senderName: me.nickname,
    });
  };

  const handleRemindMedicine = (medName: string) => {
    audio.playReminder();
    haptic.medium();
    showToast(`Đã gửi thông báo nhắc uống "${medName}"! 💊`);
    broadcastCoupleAction({
      type: 'medicine',
      senderRole: settings.currentActiveUser,
      senderName: me.nickname,
      detail: medName,
    });
  };

  const handleTriggerInteraction = (interaction: CustomInteraction) => {
    triggerLoveConfetti();
    if (interaction.id === 'kiss') {
      audio.playKiss();
    } else if (interaction.id === 'water' || interaction.id === 'medicine') {
      audio.playReminder();
    } else {
      audio.playKiss();
    }
    haptic.heartbeat();

    const notifMsg = interaction.notificationMessage || `vừa gửi: ${interaction.label}! 💕`;
    showToast(`Đã gửi "${interaction.label}" tới ${partner.nickname}! 💕`);

    broadcastCoupleAction({
      type: interaction.id,
      senderRole: settings.currentActiveUser,
      senderName: me.nickname,
      customText: `${me.nickname} ${notifMsg}`,
    });

    showSystemNotification(`💕 ${me.nickname}`, `${me.nickname} ${notifMsg}`);
  };

  // Chat Actions
  const handleSendMessage = (msgData: { text?: string; imageUrl?: string; stickerUrl?: string }) => {
    const currentUserId = settings.currentActiveUser === 'husband' ? settings.partner1.id : settings.partner2.id;
    const msgId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newMsg: ChatMessage = {
      id: msgId,
      senderId: currentUserId,
      text: msgData.text,
      imageUrl: msgData.imageUrl,
      stickerUrl: msgData.stickerUrl,
      createdAt: new Date().toISOString(),
      reactions: {},
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    audio.playPop();
    haptic.light();
    insertChatMessage(newMsg);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    const currentUserId = settings.currentActiveUser === 'husband' ? settings.partner1.id : settings.partner2.id;
    let nextReactions: Record<string, string[]> = {};

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const currentUsers = msg.reactions?.[emoji] || [];
        const isReacted = currentUsers.includes(currentUserId);
        const updatedUsers = isReacted
          ? currentUsers.filter((id) => id !== currentUserId)
          : [...currentUsers, currentUserId];

        const updatedReactions = { ...msg.reactions };
        if (updatedUsers.length > 0) {
          updatedReactions[emoji] = updatedUsers;
        } else {
          delete updatedReactions[emoji];
        }

        nextReactions = updatedReactions;
        return { ...msg, reactions: updatedReactions };
      })
    );
    audio.playPop();
    haptic.light();
    updateChatMessage(messageId, { reactions: nextReactions });
  };

  const handleTogglePin = (messageId: string) => {
    let nextPinned = false;
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          nextPinned = !msg.isPinned;
          return { ...msg, isPinned: nextPinned };
        }
        return msg;
      })
    );
    audio.playPop();
    showToast('Đã cập nhật ghim tin nhắn!');
    updateChatMessage(messageId, { isPinned: nextPinned });
  };

  // To-Do Actions
  const handleToggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== todoId) return t;
        const nextState = !t.isCompleted;
        if (nextState) {
          audio.playCelebrate();
          haptic.heartbeat();
          broadcastCoupleAction({
            type: 'todo_completed',
            senderRole: settings.currentActiveUser,
            senderName: me.nickname,
            detail: t.title,
          });
        }
        updateTodoStatus(todoId, nextState, settings.currentActiveUser);
        return {
          ...t,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
          completedBy: settings.currentActiveUser,
        };
      })
    );
  };

  const handleAddTodo = (todo: Omit<TodoItem, 'id' | 'createdAt' | 'isCompleted'>) => {
    const todoId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'todo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newTodo: TodoItem = {
      ...todo,
      id: todoId,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    audio.playPop();
    showToast('Đã thêm việc cần làm chung!');
    insertTodo(newTodo);
  };

  const handleUpdateTodo = (todoId: string, updated: Partial<TodoItem>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === todoId ? { ...t, ...updated } : t))
    );
    audio.playPop();
    showToast('Đã cập nhật việc cần làm!');
    updateTodo(todoId, updated);
  };

  const handleDeleteTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== todoId));
    deleteTodoSync(todoId);
  };

  // Places Actions
  const handleAddPlace = (place: Omit<PlaceFoodItem, 'id' | 'createdAt' | 'addedBy'>) => {
    const placeId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'place_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newPlace: PlaceFoodItem = {
      ...place,
      id: placeId,
      addedBy: settings.currentActiveUser === 'husband' ? settings.partner1.id : settings.partner2.id,
      createdAt: new Date().toISOString(),
    };
    setPlaces((prev) => [newPlace, ...prev]);
    audio.playPop();
    showToast('Đã thêm quán mới vào danh sách!');
    insertPlace(newPlace);
  };

  const handleUpdatePlace = (placeId: string, updated: Partial<PlaceFoodItem>) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === placeId ? { ...p, ...updated } : p))
    );
    audio.playPop();
    showToast('Đã cập nhật thông tin quán!');
    updatePlace(placeId, updated);
  };

  const handleToggleVisitedPlace = (placeId: string) => {
    let nextVisited = false;
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          nextVisited = !p.isVisited;
          return { ...p, isVisited: nextVisited };
        }
        return p;
      })
    );
    audio.playCelebrate();
    showToast('Đã cập nhật trạng thái quán!');
    togglePlaceVisited(placeId, nextVisited);
  };

  const handleDeletePlace = (placeId: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    deletePlaceSync(placeId);
  };

  // Memory Actions
  const handleAddMemory = (memory: Omit<MemoryPhoto, 'id' | 'createdAt' | 'uploadedBy'>) => {
    const memId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newMem: MemoryPhoto = {
      ...memory,
      id: memId,
      uploadedBy: settings.currentActiveUser === 'husband' ? settings.partner1.id : settings.partner2.id,
      createdAt: new Date().toISOString(),
    };
    setMemories((prev) => [newMem, ...prev]);
    audio.playCelebrate();
    triggerLoveConfetti();
    showToast('Đã lưu khoảnh khắc kỷ niệm mới! 📸✨');
    insertMemory(newMem);
  };

  const handleUpdateMemory = (memoryId: string, updated: Partial<MemoryPhoto>) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, ...updated } : m))
    );
    audio.playPop();
    showToast('Đã cập nhật kỷ niệm!');
    updateMemory(memoryId, updated);
  };

  const handleDeleteMemory = (memId: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== memId));
    deleteMemorySync(memId);
  };

  // Nếu chưa đăng nhập / chưa ghép đôi SĐT -> hiển thị màn hình Auth & Ghép Đôi
  if (!authSession) {
    return (
      <AuthAndPairingView
        onAuthSuccess={(session) => {
          setAuthSession(session);
          setSettings((prev) => ({
            ...prev,
            currentActiveUser: session.role,
            anniversaryDate: session.anniversaryDate || prev.anniversaryDate,
            partner1: {
              ...prev.partner1,
              name: session.role === 'husband' ? session.name : session.partnerName,
              nickname: session.role === 'husband' ? session.name : session.partnerName,
            },
            partner2: {
              ...prev.partner2,
              name: session.role === 'wife' ? session.name : session.partnerName,
              nickname: session.role === 'wife' ? session.name : session.partnerName,
            },
          }));
          showToast(`Chào mừng ${session.name} đến với Không Gian Yêu! 💕`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen relative text-slate-800 flex flex-col font-sans selection:bg-rose-200 overflow-x-hidden">
      {/* Living Ambient Romantic Aurora Background */}
      <RomanticAuroraBackground />

      {/* Interactive Touch Particle Heart Trail */}
      <ParticleHeartTrail />

      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-xl border border-white/20 animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <TopHeader
        currentRole={settings.currentActiveUser}
        partner1={settings.partner1}
        partner2={settings.partner2}
        onSwitchRole={handleSwitchRole}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onShowToast={showToast}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          showToast('Đã lưu tùy chỉnh thành công! ✨');
        }}
        onLogout={() => {
          setAuthSession(null);
          setIsSettingsOpen(false);
          showToast('Đã đăng xuất khỏi không gian yêu.');
        }}
      />

      {/* Main Content Area with Safe Spacing for Floating Dock */}
      <main className="flex-1 p-3.5 sm:p-5 pb-28 max-w-2xl mx-auto w-full relative z-10">
        {/* Banner Tải & Cài Đặt App Khi Đang Dùng Bản Web */}
        <PWAInstallBanner />

        {activeTab === 'home' && (
          <DashboardView
            currentRole={settings.currentActiveUser}
            partner1={settings.partner1}
            partner2={settings.partner2}
            anniversaryDate={settings.anniversaryDate}
            moodData={moods}
            healthData={healthData}
            todos={todos}
            onUpdateMood={handleUpdateMood}
            onNavigateTab={setActiveTab}
            onTriggerInteraction={handleTriggerInteraction}
            onPokeHeart={handlePokeHeart}
            onSendKiss={handleSendKiss}
            onRemindWater={handleRemindWater}
            onSendHug={handleSendHug}
            onToggleTodo={handleToggleTodo}
            onAddTodo={handleAddTodo}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        )}

        {activeTab === 'health' && (
          <HealthCareView
            currentRole={settings.currentActiveUser}
            partner1={settings.partner1}
            partner2={settings.partner2}
            healthData={healthData}
            onUpdateHealth={(userId, updated) => {
              const prevHealth: HealthStatus = healthData[userId] || {
                userId,
                illnessName: 'Khỏe mạnh bình thường',
                symptoms: '',
                severity: 'mild',
                medicines: [],
                allergies: [],
                dislikedFoods: [],
                favoriteComfortFoods: [],
                lastUpdated: new Date().toISOString(),
              };
              const updatedHealth: HealthStatus = {
                ...prevHealth,
                ...updated,
                userId,
                lastUpdated: new Date().toISOString(),
              };
              setHealthData((prev) => ({
                ...prev,
                [userId]: updatedHealth,
              }));
              audio.playPop();
              showToast('Đã lưu hồ sơ sức khỏe thành công! ✨');
              upsertHealthStatus(userId, updatedHealth);
            }}
            onRemindMedicine={handleRemindMedicine}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            currentRole={settings.currentActiveUser}
            partner1={settings.partner1}
            partner2={settings.partner2}
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddReaction={handleAddReaction}
            onTogglePin={handleTogglePin}
          />
        )}

        {activeTab === 'places' && (
          <PlacesView
            currentRole={settings.currentActiveUser}
            places={places}
            onAddPlace={handleAddPlace}
            onUpdatePlace={handleUpdatePlace}
            onToggleVisited={handleToggleVisitedPlace}
            onDeletePlace={handleDeletePlace}
          />
        )}

        {activeTab === 'memories' && (
          <MemoryGalleryView
            currentRole={settings.currentActiveUser}
            memories={memories}
            onAddMemory={handleAddMemory}
            onUpdateMemory={handleUpdateMemory}
            onDeleteMemory={handleDeleteMemory}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          audio.playPop();
          haptic.light();
        }}
      />
    </div>
  );
}

export default App;
