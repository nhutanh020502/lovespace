import React, { useState } from 'react';
import { clsx } from 'clsx';
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
import { DatingPlanView } from './features/plans/components/DatingPlanView';
import { VocabularyView } from './features/vocabulary/components/VocabularyView';
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
import { INITIAL_PLANS } from './constants/initialPlans';
import {
  UserRole,
  MoodStatus,
  MoodReplyContext,
  HealthStatus,
  ChatMessage,
  MemoryPhoto,
  PlaceFoodItem,
  TodoItem,
  CustomInteraction,
} from './types/common.types';
import { DatingPlan } from './types/plan.types';
import { VocabTopic, VocabStreak } from './types/vocab.types';
import { triggerLoveConfetti, triggerCelebration } from './components/ui/ConfettiEffect';
import { generateUUID } from './utils/uuidUtils';
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
  fetchPlans,
  insertPlan,
  updatePlan,
  deletePlan as deletePlanSync,
  fetchVocabTopics,
  insertVocabTopic,
  updateVocabTopic,
  deleteVocabTopic,
  fetchVocabStreak,
  upsertVocabStreak,
  fetchCoupleById,
  updateCoupleSettings,
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
  partner1Avatar?: string;
  partner2Avatar?: string;
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
  const [plans, setPlans] = useLocalStorage<DatingPlan[]>('lovespace_plans', INITIAL_PLANS);
  const [vocabTopics, setVocabTopics] = useLocalStorage<VocabTopic[]>('lovespace_vocab_topics', []);
  const [vocabStreak, setVocabStreak] = useLocalStorage<VocabStreak>('lovespace_vocab_streak', {
    currentStreak: 0,
    longestStreak: 0,
    history: {}
  });

  // Active Navigation Tab & Unread Chat Counter
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeReplyMood, setActiveReplyMood] = useState<MoodReplyContext | null>(null);

  // Tự động xóa unread count khi chuyển sang tab Chat
  React.useEffect(() => {
    if (activeTab === 'chat') {
      setUnreadChatCount(0);
    }
  }, [activeTab]);

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

  // Tự động dọn dẹp dữ liệu mẫu cũ nếu còn lưu trong localStorage trình duyệt
  React.useEffect(() => {
    const mockMsgIds = ['msg_1', 'msg_2', 'msg_3', 'msg_4'];
    const mockMemIds = ['mem_1', 'mem_2', 'mem_3'];
    const mockPlaceIds = ['place_1', 'place_2', 'place_3', 'place_4'];
    const mockTodoIds = ['todo_1', 'todo_2', 'todo_3'];
    const mockPlanIds = ['plan_3108'];

    setMessages((prev) => prev.filter((m) => !mockMsgIds.includes(m.id)));
    setMemories((prev) => prev.filter((m) => !mockMemIds.includes(m.id)));
    setPlaces((prev) => prev.filter((p) => !mockPlaceIds.includes(p.id)));
    setTodos((prev) => prev.filter((t) => !mockTodoIds.includes(t.id)));
    setPlans((prev) => prev.filter((p) => !mockPlanIds.includes(p.id)));
    localStorage.removeItem('lovespace_vocab_sets');

    // Tự động phát hiện và sửa lỗi trùng avatar giữa Chồng và Vợ do phiên bản cũ gây ra
    if (settings.partner1.avatar && settings.partner2.avatar && settings.partner1.avatar === settings.partner2.avatar) {
      const healedWifeAvatar = INITIAL_SETTINGS.partner2.avatar;
      setSettings((prev) => ({
        ...prev,
        partner2: {
          ...prev.partner2,
          avatar: healedWifeAvatar,
        },
      }));
      if (authSession?.coupleId) {
        updateCoupleSettings(authSession.coupleId, {
          partner2_avatar: healedWifeAvatar,
        });
      }
    }
  }, []);

  // 1. Tải dữ liệu ban đầu từ Supabase (nếu có cấu hình)
  React.useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const loadCloudData = async () => {
      try {
        const [cloudMoods, cloudHealth, cloudMsgs, cloudPlaces, cloudTodos, cloudMems, cloudPlans, cloudVocabTopics, cloudVocabStreak, cloudCouple] = await Promise.all([
          fetchMoodStatuses(),
          fetchHealthStatuses(),
          fetchChatMessages(),
          fetchPlaces(),
          fetchTodos(),
          fetchMemories(),
          fetchPlans(),
          fetchVocabTopics(),
          fetchVocabStreak(authSession?.coupleId),
          authSession?.coupleId ? fetchCoupleById(authSession.coupleId) : Promise.resolve(null),
        ]);

        if (cloudMoods) setMoods(cloudMoods);
        if (cloudHealth) setHealthData(cloudHealth);
        if (cloudMsgs && cloudMsgs.length > 0) setMessages(cloudMsgs);
        if (cloudPlaces && cloudPlaces.length > 0) setPlaces(cloudPlaces);
        if (cloudTodos && cloudTodos.length > 0) setTodos(cloudTodos);
        if (cloudMems && cloudMems.length > 0) setMemories(cloudMems);
        if (cloudPlans && cloudPlans.length > 0) setPlans(cloudPlans);
        if (cloudVocabTopics && cloudVocabTopics.length > 0) setVocabTopics(cloudVocabTopics);
        if (cloudVocabStreak) setVocabStreak(cloudVocabStreak);

        if (cloudCouple) {
          const isP1Husband = cloudCouple.partner1_role !== 'wife';
          const husbandName = isP1Husband ? cloudCouple.partner1_name : cloudCouple.partner2_name;
          const husbandAvatar = isP1Husband ? cloudCouple.partner1_avatar : cloudCouple.partner2_avatar;
          const wifeName = isP1Husband ? cloudCouple.partner2_name : cloudCouple.partner1_name;
          const wifeAvatar = isP1Husband ? cloudCouple.partner2_avatar : cloudCouple.partner1_avatar;

          setSettings((prev) => {
            const finalHusbandAvatar = husbandAvatar || prev.partner1.avatar;
            let finalWifeAvatar = wifeAvatar || prev.partner2.avatar;
            // Tự động tách nếu bị trùng avatar từ phiên bản trước
            if (finalHusbandAvatar && finalWifeAvatar && finalHusbandAvatar === finalWifeAvatar) {
              finalWifeAvatar = INITIAL_SETTINGS.partner2.avatar;
            }

            return {
              ...prev,
              anniversaryDate: cloudCouple.anniversary_date || prev.anniversaryDate,
              partner1: {
                ...prev.partner1,
                name: husbandName || prev.partner1.name,
                nickname: husbandName || prev.partner1.nickname,
                avatar: finalHusbandAvatar,
              },
              partner2: {
                ...prev.partner2,
                name: wifeName || prev.partner2.name,
                nickname: wifeName || prev.partner2.nickname,
                avatar: finalWifeAvatar,
              },
            };
          });
        }
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
        } else if (payload.type === 'vocab_nudge') {
          audio.playReminder();
          haptic.heartbeat();
          showToast(`📚 ${payload.senderName} đang chờ bạn cùng học 10 từ vựng hôm nay đó!`);
          showSystemNotification('📚 Nhắc Học Từ Vựng Cặp Đôi', `${payload.senderName} đang chờ bạn cùng học 10 từ hôm nay nè 💕`);
        } else {
          // Xử lý toàn bộ các nút tương tác tự tạo (Custom 1-touch Interactions)
          triggerLoveConfetti();
          audio.playKiss();
          haptic.heartbeat();
          const customMsg = payload.customText || `${payload.senderName} vừa gửi tương tác yêu thương! 💕`;
          showToast(customMsg);
          showSystemNotification(`💕 ${payload.senderName}`, customMsg);
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
            const myPartnerId = settings.currentActiveUser === 'husband' ? settings.partner2.id : settings.partner1.id;
            if (payload.new.user_id === myPartnerId) {
              audio.playReminder();
              showToast(`${partner.nickname} vừa cập nhật hồ sơ sức khỏe! 🩺`);
              showSystemNotification(
                `🩺 ${partner.nickname} Cập Nhật Sức Khỏe`,
                `Tình trạng: ${payload.new.illness_name || 'Bình thường'}`
              );
            }
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
            replyToMood: payload.new.reply_to_mood,
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
              setUnreadChatCount((prevCount) => (activeTab !== 'chat' ? prevCount + 1 : 0));
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
            setTodos((prev) => {
              if (prev.some((t) => t.id === newTodo.id)) return prev;
              showToast(`${partner.nickname} vừa thêm việc mới: "${newTodo.title}"! 📝`);
              showSystemNotification(
                '📝 Việc Cần Làm Mới',
                `${partner.nickname} vừa thêm việc: "${newTodo.title}"`
              );
              return [newTodo, ...prev];
            });
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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dating_plans' },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newPlan: DatingPlan = {
              id: payload.new.id,
              title: payload.new.title,
              startDate: payload.new.start_date,
              endDate: payload.new.end_date,
              totalDays: payload.new.total_days || 1,
              timeHeaderNote: payload.new.time_header_note,
              summaryBudgetNote: payload.new.summary_budget_note,
              destination: payload.new.destination,
              coverUrl: payload.new.cover_url,
              hotelInfo: payload.new.hotel_info || {},
              transportInfo: payload.new.transport_info,
              status: payload.new.status || 'upcoming',
              items: payload.new.items || [],
              packingList: payload.new.packing_list || [],
              createdBy: payload.new.created_by,
              createdAt: payload.new.created_at,
              updatedAt: payload.new.updated_at,
            };
            setPlans((prev) => (prev.some((p) => p.id === newPlan.id) ? prev : [newPlan, ...prev]));
            if (newPlan.createdBy !== me.id) {
              audio.playCelebrate();
              showToast(`${partner.nickname} vừa tạo kế hoạch mới: "${newPlan.title}"! 🗓️✨`);
              showSystemNotification(
                '🗓️ Kế Hoạch Mới',
                `${partner.nickname} vừa tạo: "${newPlan.title}"`
              );
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setPlans((prev) =>
              prev.map((p) =>
                p.id === payload.new.id
                  ? {
                      ...p,
                      title: payload.new.title,
                      startDate: payload.new.start_date,
                      endDate: payload.new.end_date,
                      totalDays: payload.new.total_days || 1,
                      timeHeaderNote: payload.new.time_header_note,
                      summaryBudgetNote: payload.new.summary_budget_note,
                      destination: payload.new.destination,
                      coverUrl: payload.new.cover_url,
                      hotelInfo: payload.new.hotel_info || {},
                      transportInfo: payload.new.transport_info,
                      status: payload.new.status || 'upcoming',
                      items: payload.new.items || [],
                      packingList: payload.new.packing_list || [],
                      updatedAt: payload.new.updated_at,
                    }
                  : p
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setPlans((prev) => prev.filter((p) => p.id !== payload.old.id));
          } else {
            fetchPlans().then((data) => data && setPlans(data));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'couples' },
        (payload: any) => {
          if (payload.new && authSession && payload.new.id === authSession.coupleId) {
            const cp = payload.new;
            const isP1Husband = cp.partner1_role !== 'wife';
            const husbandName = isP1Husband ? cp.partner1_name : cp.partner2_name;
            const husbandAvatar = isP1Husband ? cp.partner1_avatar : cp.partner2_avatar;
            const wifeName = isP1Husband ? cp.partner2_name : cp.partner1_name;
            const wifeAvatar = isP1Husband ? cp.partner2_avatar : cp.partner1_avatar;

            setSettings((prev) => {
              const finalHusbandAvatar = husbandAvatar || prev.partner1.avatar;
              let finalWifeAvatar = wifeAvatar || prev.partner2.avatar;
              if (finalHusbandAvatar && finalWifeAvatar && finalHusbandAvatar === finalWifeAvatar) {
                finalWifeAvatar = INITIAL_SETTINGS.partner2.avatar;
              }

              return {
                ...prev,
                anniversaryDate: cp.anniversary_date || prev.anniversaryDate,
                partner1: {
                  ...prev.partner1,
                  name: husbandName || prev.partner1.name,
                  nickname: husbandName || prev.partner1.nickname,
                  avatar: finalHusbandAvatar,
                },
                partner2: {
                  ...prev.partner2,
                  name: wifeName || prev.partner2.name,
                  nickname: wifeName || prev.partner2.nickname,
                  avatar: finalWifeAvatar,
                },
              };
            });
            showToast('Cài đặt & ngày yêu vừa được cập nhật từ đối phương! 💕');
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vocab_topics' },
        (payload: any) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            const newTopic: VocabTopic = {
              id: payload.new.id,
              title: payload.new.title,
              description: payload.new.description,
              emoji: payload.new.emoji || '📚',
              colorTheme: payload.new.color_theme || 'rose',
              words: payload.new.words || [],
              reward: payload.new.reward || undefined,
              createdBy: payload.new.created_by,
              createdAt: payload.new.created_at,
              updatedAt: payload.new.updated_at,
            };
            setVocabTopics((prev) => (prev.some((t) => t.id === newTopic.id) ? prev : [newTopic, ...prev]));
            if (newTopic.createdBy !== me.id) {
              audio.playCelebrate();
              showToast(`${partner.nickname} vừa tạo chủ đề mới: "${newTopic.title}"! 📚✨`);
              showSystemNotification('📚 Chủ Đề Mới', `${partner.nickname} vừa tạo: "${newTopic.title}"`);
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setVocabTopics((prev) =>
              prev.map((t) =>
                t.id === payload.new.id
                  ? {
                      ...t,
                      title: payload.new.title,
                      description: payload.new.description,
                      emoji: payload.new.emoji || '📚',
                      colorTheme: payload.new.color_theme || 'rose',
                      words: payload.new.words || [],
                      reward: payload.new.reward || undefined,
                      updatedAt: payload.new.updated_at,
                    }
                  : t
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setVocabTopics((prev) => prev.filter((t) => t.id !== payload.old.id));
          } else {
            fetchVocabTopics().then((data) => data && setVocabTopics(data));
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
      setActiveRealtimeChannel(null);
    };
  }, [settings.currentActiveUser, authSession?.coupleId]);

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
  const handleSendMessage = (msgData: { text?: string; imageUrl?: string; stickerUrl?: string; replyToMood?: MoodReplyContext }) => {
    const currentUserId = settings.currentActiveUser === 'husband' ? settings.partner1.id : settings.partner2.id;
    const msgId = generateUUID();

    const newMsg: ChatMessage = {
      id: msgId,
      senderId: currentUserId,
      text: msgData.text,
      imageUrl: msgData.imageUrl,
      stickerUrl: msgData.stickerUrl,
      replyToMood: msgData.replyToMood,
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
    const todoId = generateUUID();

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
    const placeId = generateUUID();

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
    const memId = generateUUID();

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

  // Plan Actions (Lịch trình hẹn hò & Du lịch dài ngày)
  const handleAddPlan = (newPlan: DatingPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    audio.playCelebrate();
    triggerLoveConfetti();
    showToast(`Đã tạo kế hoạch "${newPlan.title}" thành công! 🗓️✨`);
    insertPlan(newPlan);
  };

  const handleUpdatePlan = (updatedPlan: DatingPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    updatePlan(updatedPlan.id, updatedPlan);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    audio.playPop();
    showToast('Đã xóa kế hoạch!');
    deletePlanSync(planId);
  };

  // Vocabulary Actions (Topic-Driven)
  const handleAddVocabTopic = (newTopic: VocabTopic) => {
    setVocabTopics((prev) => [newTopic, ...prev]);
    audio.playCelebrate();
    insertVocabTopic(newTopic);
  };

  const handleUpdateVocabTopic = (updatedTopic: VocabTopic) => {
    setVocabTopics((prev) =>
      prev.map((t) => (t.id === updatedTopic.id ? updatedTopic : t))
    );
    updateVocabTopic(updatedTopic.id, updatedTopic);
  };

  const handleDeleteVocabTopic = (topicId: string) => {
    setVocabTopics((prev) => prev.filter((t) => t.id !== topicId));
    audio.playPop();
    deleteVocabTopic(topicId);
  };

  const handleUpdateVocabStreak = (newStreak: VocabStreak) => {
    setVocabStreak(newStreak);
    if (authSession?.coupleId) {
      upsertVocabStreak(newStreak, authSession.coupleId);
    }
  };

  const handleNudgePartnerVocab = () => {
    broadcastCoupleAction({
      type: 'vocab_nudge',
      senderRole: settings.currentActiveUser,
      senderName: me.nickname,
      detail: 'Học 10 từ hôm nay',
    });
    audio.playReminder();
    haptic.medium();
  };

  // Nếu chưa đăng nhập / chưa ghép đôi SĐT -> hiển thị màn hình Auth & Ghép Đôi
  if (!authSession) {
    return (
      <AuthAndPairingView
        onAuthSuccess={(session) => {
          setAuthSession(session);
          setSettings((prev) => {
            const isSessionHusband = session.role === 'husband';
            const husbandName = isSessionHusband ? session.name : session.partnerName;
            const wifeName = isSessionHusband ? session.partnerName : session.name;
            const husbandAvatar = isSessionHusband
              ? (session.partner1Avatar || prev.partner1.avatar)
              : (session.partner2Avatar || prev.partner1.avatar);
            let wifeAvatar = isSessionHusband
              ? (session.partner2Avatar || prev.partner2.avatar)
              : (session.partner1Avatar || prev.partner2.avatar);

            if (husbandAvatar && wifeAvatar && husbandAvatar === wifeAvatar) {
              wifeAvatar = INITIAL_SETTINGS.partner2.avatar;
            }

            return {
              ...prev,
              currentActiveUser: session.role,
              anniversaryDate: session.anniversaryDate || prev.anniversaryDate,
              partner1: {
                ...prev.partner1,
                name: husbandName,
                nickname: husbandName,
                avatar: husbandAvatar,
              },
              partner2: {
                ...prev.partner2,
                name: wifeName,
                nickname: wifeName,
                avatar: wifeAvatar,
              },
            };
          });
          showToast(`Chào mừng ${session.name} đến với Không Gian Yêu! 💕`);
        }}
      />
    );
  }

  return (
    <div
      className={clsx(
        'relative text-slate-800 flex flex-col font-sans selection:bg-rose-200',
        activeTab === 'chat' ? 'h-[100dvh] overflow-hidden' : 'min-h-screen overflow-x-hidden'
      )}
    >
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
          if (authSession) {
            setAuthSession((prev) =>
              prev
                ? {
                    ...prev,
                    anniversaryDate: newSettings.anniversaryDate,
                    name: prev.role === 'husband' ? newSettings.partner1.nickname : newSettings.partner2.nickname,
                    partnerName: prev.role === 'husband' ? newSettings.partner2.nickname : newSettings.partner1.nickname,
                    partner1Avatar: newSettings.partner1.avatar,
                    partner2Avatar: newSettings.partner2.avatar,
                  }
                : null
            );

            if (authSession.coupleId) {
              updateCoupleSettings(authSession.coupleId, {
                anniversary_date: newSettings.anniversaryDate,
                partner1_name: newSettings.partner1.nickname,
                partner1_avatar: newSettings.partner1.avatar,
                partner2_name: newSettings.partner2.nickname,
                partner2_avatar: newSettings.partner2.avatar,
              });
            }
          }
          showToast('Đã lưu tùy chỉnh thành công! ✨');
        }}
        onLogout={() => {
          setAuthSession(null);
          setIsSettingsOpen(false);
          showToast('Đã đăng xuất khỏi không gian yêu.');
        }}
      />

      {/* Main Content Area with Safe Spacing for Floating Dock */}
      <main
        className={clsx(
          'flex-1 max-w-2xl mx-auto w-full relative z-10 transition-all',
          activeTab === 'chat'
            ? 'px-2.5 sm:px-4 pb-[76px] flex flex-col min-h-0'
            : 'px-3.5 pt-3.5 sm:px-5 sm:pt-5 main-scroll-clearance'
        )}
      >
        {/* Banner Tải & Cài Đặt App Khi Đang Dùng Bản Web (Chỉ hiện ở Home để không choán không gian chat) */}
        {activeTab !== 'chat' && <PWAInstallBanner />}

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
            onOpenChatWithMood={(replyCtx) => {
              setActiveReplyMood(replyCtx);
              setActiveTab('chat');
            }}
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

        {activeTab === 'plans' && (
          <DatingPlanView
            plans={plans}
            onAddPlan={handleAddPlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
            currentUserId={me.id}
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
            replyMood={activeReplyMood}
            onClearReplyMood={() => setActiveReplyMood(null)}
            onSendMessage={handleSendMessage}
            onAddReaction={handleAddReaction}
            onTogglePin={handleTogglePin}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabularyView
            currentRole={settings.currentActiveUser}
            partner1={settings.partner1}
            partner2={settings.partner2}
            topics={vocabTopics}
            streak={vocabStreak}
            onAddTopic={handleAddVocabTopic}
            onUpdateTopic={handleUpdateVocabTopic}
            onDeleteTopic={handleDeleteVocabTopic}
            onUpdateStreak={handleUpdateVocabStreak}
            onNudgePartner={handleNudgePartnerVocab}
            onShowToast={showToast}
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
        unreadCount={unreadChatCount}
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
