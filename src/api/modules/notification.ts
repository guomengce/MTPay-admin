import request from '../request';

// 管理端路径已确认；响应沿用已确认的代理端通知结构，待管理端实际响应验证。
export type NotificationBusiness = 'whitelist' | 'withdrawal' | 'deposit' | 'exchange';
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
export interface NotificationListParams { page: number; limit: number; is_read?: 0 | 1; business_type?: NotificationBusiness }
export interface NotificationPage {
  current_page: number;
  data: AdminNotification[];
  last_page: number;
  per_page: number;
  total: number;
}
export interface NotificationListResult { unread_count: number; notifications: NotificationPage }
export const fetchNotificationSummary = () => request.get<unknown, NotificationSummary>('/admin/getNotificationSummary');
export const fetchNotificationList = (params: NotificationListParams) => request.get<unknown, NotificationListResult>('/admin/getNotificationList', { params });
export const readNotification = (id: AdminNotification['id']) => request.post('/admin/readNotification', { id });
export const readAllNotifications = () => request.post('/admin/readAllNotifications');
