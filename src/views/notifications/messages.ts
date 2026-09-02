/** 管理端通知文案，與現有管理界面保持中文。 */
const messages: Record<string, string> = {
  "notifications.title": "消息中心",
  "notifications.subtitle": "查看審核、補件及付款結果",
  "notifications.recent": "最近通知",
  "notifications.unreadCount": "未讀（{count}）",
  "notifications.empty": "暫無消息",
  "notifications.viewAll": "查看全部消息",
  "notifications.markAll": "全部標為已讀",
  "notifications.recentCount": "顯示最近 {count} 則",
  "notifications.all": "全部",
  "notifications.unread": "未讀",
  "notifications.read": "已讀",
  "notifications.readStatus": "閲讀狀態",
  "notifications.businessType": "業務類型",
  "notifications.allBusiness": "全部業務",
  "notifications.viewDetails": "查看詳情",
  "notifications.loadFailed": "消息加載失敗，請重試或核對接口響應",
  "notifications.retry": "重試",
  "notifications.business.whitelist": "白名單",
  "notifications.business.withdrawal": "法幣出金",
  "notifications.business.deposit": "數字貨幣入金",
  "notifications.business.exchange": "數字貨幣兌換"
};

export function notificationText(key: string, params: Record<string, string | number> = {}) {
  return (messages[key] ?? key).replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match));
}
