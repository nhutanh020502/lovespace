import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  MoodStatus,
  HealthStatus,
  ChatMessage,
  PlaceFoodItem,
  TodoItem,
  MemoryPhoto,
} from '../types/common.types';
import { DatingPlan } from '../types/plan.types';

// ==============================================================================
// 1. MOOD STATUS SYNC
// ==============================================================================
export async function fetchMoodStatuses(): Promise<Record<string, MoodStatus> | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('mood_status').select('*');
    if (error || !data) return null;
    const map: Record<string, MoodStatus> = {};
    data.forEach((row: any) => {
      map[row.user_id] = {
        userId: row.user_id,
        mood: row.mood,
        caption: row.caption,
        photoUrl: row.photo_url,
        updatedAt: row.updated_at,
        isCustomPhoto: row.is_custom_photo,
      };
    });
    return Object.keys(map).length > 0 ? map : null;
  } catch {
    return null;
  }
}

export async function upsertMoodStatus(mood: MoodStatus) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('mood_status').upsert(
      {
        user_id: mood.userId,
        mood: mood.mood,
        caption: mood.caption,
        photo_url: mood.photoUrl,
        is_custom_photo: mood.isCustomPhoto || false,
        updated_at: mood.updatedAt || new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  } catch (err) {
    console.error('Failed to sync mood status:', err);
  }
}

// ==============================================================================
// 2. HEALTH STATUS SYNC
// ==============================================================================
export async function fetchHealthStatuses(): Promise<Record<string, HealthStatus> | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('health_care').select('*');
    if (error || !data) return null;
    const map: Record<string, HealthStatus> = {};
    data.forEach((row: any) => {
      map[row.user_id] = {
        userId: row.user_id,
        illnessName: row.illness_name,
        symptoms: row.symptoms,
        severity: row.severity,
        medicines: row.medicines || [],
        allergies: row.allergies || [],
        dislikedFoods: row.disliked_foods || [],
        favoriteComfortFoods: row.favorite_comfort_foods || [],
        periodTracking: row.period_tracking,
        lastUpdated: row.last_updated,
      };
    });
    return Object.keys(map).length > 0 ? map : null;
  } catch {
    return null;
  }
}

export async function upsertHealthStatus(userId: string, health: HealthStatus) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('health_care').upsert(
      {
        user_id: userId,
        illness_name: health.illnessName,
        symptoms: health.symptoms,
        severity: health.severity,
        medicines: health.medicines,
        allergies: health.allergies,
        disliked_foods: health.dislikedFoods,
        favorite_comfort_foods: health.favoriteComfortFoods,
        period_tracking: health.periodTracking,
        last_updated: health.lastUpdated || new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  } catch (err) {
    console.error('Failed to sync health status:', err);
  }
}

// ==============================================================================
// 3. CHAT MESSAGES SYNC
// ==============================================================================
export async function fetchChatMessages(): Promise<ChatMessage[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      senderId: row.sender_id,
      text: row.text,
      imageUrl: row.image_url,
      stickerUrl: row.sticker_url,
      reactions: row.reactions || {},
      isPinned: row.is_pinned,
      status: row.status,
      createdAt: row.created_at,
    }));
  } catch {
    return null;
  }
}

export async function insertChatMessage(msg: ChatMessage) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload: any = {
      sender_id: msg.senderId,
      text: msg.text,
      image_url: msg.imageUrl,
      sticker_url: msg.stickerUrl,
      reactions: msg.reactions || {},
      is_pinned: msg.isPinned || false,
      status: msg.status || 'sent',
      created_at: msg.createdAt,
    };
    if (msg.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(msg.id)) {
      payload.id = msg.id;
    }
    const { error } = await supabase.from('chat_messages').insert(payload);
    if (error) console.error('insertChatMessage error:', error);
  } catch (err) {
    console.error('Failed to insert chat message:', err);
  }
}

export async function updateChatMessage(msgId: string, updates: Partial<ChatMessage>) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload: any = {};
    if (updates.reactions !== undefined) payload.reactions = updates.reactions;
    if (updates.isPinned !== undefined) payload.is_pinned = updates.isPinned;
    const { error } = await supabase.from('chat_messages').update(payload).eq('id', msgId);
    if (error) console.error('updateChatMessage error:', error);
  } catch (err) {
    console.error('Failed to update chat message:', err);
  }
}

// ==============================================================================
// 4. PLACES & FOOD SYNC
// ==============================================================================
export async function fetchPlaces(): Promise<PlaceFoodItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('places_food')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      address: row.address,
      googleMapsUrl: row.google_maps_url,
      estimatedPrice: row.estimated_price,
      mustTryDishes: row.must_try_dishes,
      notes: row.notes,
      rating: row.rating,
      isVisited: row.is_visited,
      addedBy: row.added_by,
      createdAt: row.created_at,
    }));
  } catch {
    return null;
  }
}

export async function insertPlace(place: PlaceFoodItem) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload: any = {
      name: place.name,
      category: place.category,
      address: place.address,
      google_maps_url: place.googleMapsUrl,
      estimated_price: place.estimatedPrice,
      must_try_dishes: place.mustTryDishes,
      notes: place.notes,
      rating: place.rating || 5,
      is_visited: place.isVisited || false,
      added_by: place.addedBy,
      created_at: place.createdAt,
    };
    if (place.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(place.id)) {
      payload.id = place.id;
    }
    const { error } = await supabase.from('places_food').insert(payload);
    if (error) console.error('insertPlace error:', error);
  } catch (err) {
    console.error('Failed to insert place:', err);
  }
}

export async function togglePlaceVisited(placeId: string, isVisited: boolean) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(placeId)) return;
  try {
    const { error } = await supabase.from('places_food').update({ is_visited: isVisited }).eq('id', placeId);
    if (error) console.error('togglePlaceVisited error:', error);
  } catch (err) {
    console.error('Failed to update place:', err);
  }
}

export async function updatePlace(placeId: string, updated: Partial<PlaceFoodItem>) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(placeId)) return;
  try {
    const payload: any = {};
    if (updated.name !== undefined) payload.name = updated.name;
    if (updated.category !== undefined) payload.category = updated.category;
    if (updated.address !== undefined) payload.address = updated.address;
    if (updated.googleMapsUrl !== undefined) payload.google_maps_url = updated.googleMapsUrl;
    if (updated.estimatedPrice !== undefined) payload.estimated_price = updated.estimatedPrice;
    if (updated.mustTryDishes !== undefined) payload.must_try_dishes = updated.mustTryDishes;
    if (updated.notes !== undefined) payload.notes = updated.notes;
    if (updated.rating !== undefined) payload.rating = updated.rating;
    if (updated.isVisited !== undefined) payload.is_visited = updated.isVisited;

    const { error } = await supabase.from('places_food').update(payload).eq('id', placeId);
    if (error) console.error('updatePlace error:', error);
  } catch (err) {
    console.error('Failed to update place:', err);
  }
}

export async function deletePlace(placeId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(placeId)) return;
  try {
    const { error } = await supabase.from('places_food').delete().eq('id', placeId);
    if (error) console.error('deletePlace error:', error);
  } catch (err) {
    console.error('Failed to delete place:', err);
  }
}

// ==============================================================================
// 5. SHARED TODOS SYNC
// ==============================================================================
export async function fetchTodos(): Promise<TodoItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('shared_todos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      assignedTo: row.assigned_to,
      dueDate: row.due_date,
      isCompleted: row.is_completed,
      completedAt: row.completed_at,
      completedBy: row.completed_by,
      createdAt: row.created_at,
    }));
  } catch {
    return null;
  }
}

export async function insertTodo(todo: TodoItem) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload: any = {
      title: todo.title,
      category: todo.category,
      assigned_to: todo.assignedTo,
      due_date: todo.dueDate || null,
      is_completed: todo.isCompleted || false,
      completed_at: todo.completedAt || null,
      completed_by: todo.completedBy || null,
      created_at: todo.createdAt,
    };
    if (todo.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(todo.id)) {
      payload.id = todo.id;
    }
    const { error } = await supabase.from('shared_todos').insert(payload);
    if (error) console.error('insertTodo error:', error);
  } catch (err) {
    console.error('Failed to insert todo:', err);
  }
}

export async function updateTodo(todoId: string, updated: Partial<TodoItem>) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(todoId)) return;
  try {
    const payload: any = {};
    if (updated.title !== undefined) payload.title = updated.title;
    if (updated.category !== undefined) payload.category = updated.category;
    if (updated.assignedTo !== undefined) payload.assigned_to = updated.assignedTo;
    if (updated.dueDate !== undefined) payload.due_date = updated.dueDate || null;
    if (updated.isCompleted !== undefined) payload.is_completed = updated.isCompleted;
    if (updated.completedAt !== undefined) payload.completed_at = updated.completedAt || null;
    if (updated.completedBy !== undefined) payload.completed_by = updated.completedBy || null;

    const { error } = await supabase.from('shared_todos').update(payload).eq('id', todoId);
    if (error) console.error('updateTodo error:', error);
  } catch (err) {
    console.error('Failed to update todo:', err);
  }
}

export async function updateTodoStatus(todoId: string, isCompleted: boolean, completedBy?: string) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(todoId)) return;
  try {
    const { error } = await supabase.from('shared_todos').update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
      completed_by: isCompleted ? completedBy : null,
    }).eq('id', todoId);
    if (error) console.error('updateTodoStatus error:', error);
  } catch (err) {
    console.error('Failed to update todo status:', err);
  }
}

export async function deleteTodo(todoId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(todoId)) return;
  try {
    const { error } = await supabase.from('shared_todos').delete().eq('id', todoId);
    if (error) console.error('deleteTodo error:', error);
  } catch (err) {
    console.error('Failed to delete todo:', err);
  }
}

// ==============================================================================
// 6. MEMORY GALLERY SYNC
// ==============================================================================
export async function fetchMemories(): Promise<MemoryPhoto[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('memory_gallery')
      .select('*')
      .order('date', { ascending: false });
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      photoUrl: row.photo_url,
      date: row.date,
      note: row.note,
      location: row.location,
      tags: row.tags || [],
      type: row.type || 'couple_photo',
      linkUrl: row.link_url,
      uploadedBy: row.uploaded_by,
      createdAt: row.created_at,
    }));
  } catch {
    return null;
  }
}

export async function insertMemory(memory: MemoryPhoto) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload: any = {
      photo_url: memory.photoUrl,
      date: memory.date,
      note: memory.note,
      location: memory.location,
      tags: memory.tags || [],
      type: memory.type || 'couple_photo',
      link_url: memory.linkUrl || null,
      uploaded_by: memory.uploadedBy,
      created_at: memory.createdAt,
    };
    if (memory.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memory.id)) {
      payload.id = memory.id;
    }
    const { error } = await supabase.from('memory_gallery').insert(payload);
    if (error) console.error('insertMemory error:', error);
  } catch (err) {
    console.error('Failed to insert memory:', err);
  }
}

export async function updateMemory(memoryId: string, updated: Partial<MemoryPhoto>) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memoryId)) return;
  try {
    const payload: any = {};
    if (updated.note !== undefined) payload.note = updated.note;
    if (updated.date !== undefined) payload.date = updated.date;
    if (updated.location !== undefined) payload.location = updated.location;
    if (updated.photoUrl !== undefined) payload.photo_url = updated.photoUrl;
    if (updated.tags !== undefined) payload.tags = updated.tags;
    if (updated.type !== undefined) payload.type = updated.type;
    if (updated.linkUrl !== undefined) payload.link_url = updated.linkUrl || null;

    const { error } = await supabase.from('memory_gallery').update(payload).eq('id', memoryId);
    if (error) console.error('updateMemory error:', error);
  } catch (err) {
    console.error('Failed to update memory:', err);
  }
}

export async function deleteMemory(memoryId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memoryId)) return;
  try {
    const { error } = await supabase.from('memory_gallery').delete().eq('id', memoryId);
    if (error) console.error('deleteMemory error:', error);
  } catch (err) {
    console.error('Failed to delete memory:', err);
  }
}

// ==============================================================================
// 7. DATING PLANS SYNC (Kế Hoạch & Lịch Trình Hẹn Hò / Du Lịch)
// ==============================================================================
export async function fetchPlans(): Promise<DatingPlan[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('dating_plans')
      .select('*')
      .order('start_date', { ascending: false });
    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      startDate: row.start_date,
      endDate: row.end_date,
      totalDays: row.total_days || 1,
      timeHeaderNote: row.time_header_note,
      summaryBudgetNote: row.summary_budget_note,
      destination: row.destination,
      coverUrl: row.cover_url,
      hotelInfo: row.hotel_info || {},
      transportInfo: row.transport_info,
      status: row.status || 'upcoming',
      items: row.items || [],
      packingList: row.packing_list || [],
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return null;
  }
}

export async function insertPlan(plan: DatingPlan) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const payload: any = {
      title: plan.title,
      start_date: plan.startDate,
      end_date: plan.endDate || null,
      total_days: plan.totalDays || 1,
      time_header_note: plan.timeHeaderNote || '(tại cục chồng hay đi trễ)',
      summary_budget_note: plan.summaryBudgetNote || null,
      destination: plan.destination || null,
      cover_url: plan.coverUrl || null,
      hotel_info: plan.hotelInfo || {},
      transport_info: plan.transportInfo || null,
      status: plan.status || 'upcoming',
      items: plan.items || [],
      packing_list: plan.packingList || [],
      created_by: plan.createdBy,
      created_at: plan.createdAt || new Date().toISOString(),
      updated_at: plan.updatedAt || new Date().toISOString(),
    };
    if (plan.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(plan.id)) {
      payload.id = plan.id;
    }
    const { error } = await supabase.from('dating_plans').insert(payload);
    if (error) console.error('insertPlan error:', error);
  } catch (err) {
    console.error('Failed to insert plan:', err);
  }
}

export async function updatePlan(planId: string, updated: Partial<DatingPlan>) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId)) return;
  try {
    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updated.title !== undefined) payload.title = updated.title;
    if (updated.startDate !== undefined) payload.start_date = updated.startDate;
    if (updated.endDate !== undefined) payload.end_date = updated.endDate || null;
    if (updated.totalDays !== undefined) payload.total_days = updated.totalDays;
    if (updated.timeHeaderNote !== undefined) payload.time_header_note = updated.timeHeaderNote;
    if (updated.summaryBudgetNote !== undefined) payload.summary_budget_note = updated.summaryBudgetNote;
    if (updated.destination !== undefined) payload.destination = updated.destination;
    if (updated.coverUrl !== undefined) payload.cover_url = updated.coverUrl;
    if (updated.hotelInfo !== undefined) payload.hotel_info = updated.hotelInfo;
    if (updated.transportInfo !== undefined) payload.transport_info = updated.transportInfo;
    if (updated.status !== undefined) payload.status = updated.status;
    if (updated.items !== undefined) payload.items = updated.items;
    if (updated.packingList !== undefined) payload.packing_list = updated.packingList;

    const { error } = await supabase.from('dating_plans').update(payload).eq('id', planId);
    if (error) console.error('updatePlan error:', error);
  } catch (err) {
    console.error('Failed to update plan:', err);
  }
}

export async function deletePlan(planId: string) {
  if (!isSupabaseConfigured || !supabase) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId)) return;
  try {
    const { error } = await supabase.from('dating_plans').delete().eq('id', planId);
    if (error) console.error('deletePlan error:', error);
  } catch (err) {
    console.error('Failed to delete plan:', err);
  }
}

// ==============================================================================
// 8. REALTIME INTERACTION BROADCAST (Thả tim, Hôn, Nhắc nước, Ôm, Nhắc thuốc)
// ==============================================================================
export type CoupleBroadcastType =
  | 'heart'
  | 'kiss'
  | 'water'
  | 'hug'
  | 'medicine'
  | 'todo_completed'
  | string;

export interface CoupleBroadcastPayload {
  type: CoupleBroadcastType;
  senderRole: 'husband' | 'wife';
  senderName: string;
  detail?: string;
  customText?: string;
  timestamp: string;
}

let activeRealtimeChannel: any = null;

export function setActiveRealtimeChannel(channel: any) {
  activeRealtimeChannel = channel;
}

export function broadcastCoupleAction(payload: Omit<CoupleBroadcastPayload, 'timestamp'>) {
  if (!isSupabaseConfigured || !supabase || !activeRealtimeChannel) return;
  try {
    activeRealtimeChannel.send({
      type: 'broadcast',
      event: 'couple_interaction',
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn('Failed to broadcast couple action:', err);
  }
}

// ==============================================================================
// 8. COUPLE PAIRING & PHONE AUTH MANAGEMENT (1-to-1)
// ==============================================================================
export interface CoupleRecord {
  id: string;
  invite_code: string;
  partner1_phone: string;
  partner1_name: string;
  partner1_role: 'husband' | 'wife';
  partner1_avatar?: string;
  partner2_phone?: string;
  partner2_name?: string;
  partner2_role?: 'husband' | 'wife';
  partner2_avatar?: string;
  anniversary_date?: string;
  settings?: any;
  status: 'pending' | 'active';
  created_at: string;
}

export async function fetchCoupleById(coupleId: string): Promise<CoupleRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .eq('id', coupleId)
      .maybeSingle();

    if (error || !data) return null;
    return data as CoupleRecord;
  } catch {
    return null;
  }
}

export async function updateCoupleSettings(
  coupleId: string,
  payload: Partial<CoupleRecord>
): Promise<CoupleRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('couples')
      .update(payload)
      .eq('id', coupleId)
      .select()
      .single();

    if (error || !data) {
      console.warn('Lỗi khi cập nhật cài đặt couple trên Supabase:', error);
      return null;
    }
    return data as CoupleRecord;
  } catch (err) {
    console.warn('Lỗi updateCoupleSettings:', err);
    return null;
  }
}

export async function findCoupleByPhone(phone: string): Promise<CoupleRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const cleanPhone = phone.trim();
    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .or(`partner1_phone.eq.${cleanPhone},partner2_phone.eq.${cleanPhone}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as CoupleRecord;
  } catch {
    return null;
  }
}

export async function findCoupleByInviteCode(code: string): Promise<CoupleRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const cleanCode = code.trim().toUpperCase();
    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .eq('invite_code', cleanCode)
      .maybeSingle();

    if (error || !data) return null;
    return data as CoupleRecord;
  } catch {
    return null;
  }
}

export async function createCoupleSpace(
  phone: string,
  name: string,
  role: 'husband' | 'wife',
  anniversaryDate: string = '2023-02-14'
): Promise<CoupleRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const randomCode = 'LOVE' + Math.floor(1000 + Math.random() * 9000);
    const newRecord = {
      invite_code: randomCode,
      partner1_phone: phone.trim(),
      partner1_name: name.trim(),
      partner1_role: role,
      partner2_phone: null,
      partner2_name: null,
      partner2_role: role === 'husband' ? 'wife' : 'husband',
      anniversary_date: anniversaryDate,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('couples')
      .insert(newRecord)
      .select()
      .single();

    if (error || !data) {
      console.error('createCoupleSpace error:', error);
      return null;
    }
    return data as CoupleRecord;
  } catch (err) {
    console.error('Failed to create couple space:', err);
    return null;
  }
}

export async function joinCoupleSpace(
  inviteCode: string,
  phone: string,
  name: string
): Promise<{ success: boolean; couple?: CoupleRecord; message?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, message: 'Chưa kết nối Supabase' };
  }
  try {
    const cleanCode = inviteCode.trim().toUpperCase();
    const couple = await findCoupleByInviteCode(cleanCode);

    if (!couple) {
      return { success: false, message: 'Mã ghép đôi không tồn tại. Vui lòng kiểm tra lại!' };
    }

    if (couple.status === 'active' && couple.partner2_phone) {
      if (couple.partner2_phone === phone.trim() || couple.partner1_phone === phone.trim()) {
        return { success: true, couple };
      }
      return { success: false, message: 'Không gian yêu này đã có đủ 2 người rồi!' };
    }

    if (couple.partner1_phone === phone.trim()) {
      return { success: true, couple };
    }

    const targetRole = couple.partner1_role === 'husband' ? 'wife' : 'husband';
    const { data, error } = await supabase
      .from('couples')
      .update({
        partner2_phone: phone.trim(),
        partner2_name: name.trim(),
        partner2_role: targetRole,
        status: 'active',
      })
      .eq('id', couple.id)
      .select()
      .single();

    if (error || !data) {
      return { success: false, message: 'Lỗi khi ghép đôi. Vui lòng thử lại!' };
    }

    return { success: true, couple: data as CoupleRecord };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Lỗi không xác định' };
  }
}
