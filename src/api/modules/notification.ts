import request from '../request';

// 管理端列表篩選按接口文檔使用 read_status=all/unread/read。
export type NotificationBusiness = 'whitelist' | 'withdrawal' | 'deposit' | 'exchange';
export type NotificationReadStatus = 'all' | 'unread' | 'read';
export interface AdminNotification {
  id: number | string;
  title: string;
  content: string;
  created_at: string;
  read_at: string | null;
  is_read?: boolean;
  event_type?: string;
  business_name?: string;
  business_type?: NotificationBusiness;
  business_id?: number | string;
  business_no?: string;
  detail_type?: NotificationBusiness | null;
  detail_id?: number | string | null;
}
export interface NotificationSummary { unread_count: number; recent_notifications: AdminNotification[] }
export interface NotificationUnreadCount { unread_count: number }
export interface NotificationListParams { page: number; limit: number; read_status: NotificationReadStatus; business_type?: NotificationBusiness }
export interface NotificationPage {
  current_page: number;
  data: AdminNotification[];
  last_page: number;
  per_page: number;
  total: number;
}
export interface NotificationListResult { unread_count: number; notifications: NotificationPage }
export const fetchNotificationUnreadCount = () => request.get<unknown, NotificationUnreadCount>('/admin/getNotificationUnreadCount');
export const fetchNotificationSummary = () => request.get<unknown, NotificationSummary>('/admin/getNotificationSummary');
export const fetchNotificationList = (params: NotificationListParams) => request.get<unknown, NotificationListResult>('/admin/getNotificationList', { params });
export const readNotification = (id: AdminNotification['id']) => request.post('/admin/readNotification', { id });
export const readAllNotifications = () => request.post('/admin/readAllNotifications');
