import type { AdminNotification, NotificationBusiness } from '@/api/modules/notification';
export const notificationBusinesses: NotificationBusiness[] = ['deposit', 'exchange','whitelist', 'withdrawal', ];
const routes = { whitelist: 'WhitelistDetail', withdrawal: 'WithdrawalDetail', deposit: 'DepositDetail', exchange: 'ExchangeDetail' };
const badges = { whitelist: 'WL', withdrawal: 'OUT', deposit: 'IN', exchange: 'FX' };
export function notificationBadge(type?: NotificationBusiness) { return type && Object.prototype.hasOwnProperty.call(badges, type) ? badges[type] : 'MSG'; }
export function notificationRoute(item: AdminNotification) {
  const hasDetail = item.detail_type !== undefined || item.detail_id !== undefined;
  const type = hasDetail ? item.detail_type : item.business_type;
  const id = hasDetail ? item.detail_id : item.business_id;
  if (!type || !Object.prototype.hasOwnProperty.call(routes, type) || !id) return null;
  return { name: routes[type], params: { id: String(id) } };
}

/** 已確認的 is_read 優先；兼容尚未提供響應明細的舊列表數據。 */
export function notificationIsRead(item: AdminNotification) {
  return item.is_read ?? Boolean(item.read_at);
}
