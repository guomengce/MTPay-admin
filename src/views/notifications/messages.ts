/** 管理端通知文案，与现有管理界面保持中文。 */
const messages: Record<string, string> = {
  "notifications.title": "消息中心",
  "notifications.subtitle": "查看审核、补件及付款结果",
  "notifications.recent": "最近通知",
  "notifications.unreadCount": "未读（{count}）",
  "notifications.empty": "暂无消息",
  "notifications.viewAll": "查看全部消息",
  "notifications.markAll": "全部标为已读",
  "notifications.recentCount": "显示最近 {count} 则",
  "notifications.all": "全部",
  "notifications.unread": "未读",
  "notifications.read": "已读",
  "notifications.readStatus": "阅读状态",
  "notifications.businessType": "业务类型",
  "notifications.allBusiness": "全部业务",
  "notifications.viewDetails": "查看详情",
  "notifications.loadFailed": "消息加载失败，请重试或核对接口响应",
  "notifications.retry": "重试",
  "notifications.business.whitelist": "白名单",
  "notifications.business.withdrawal": "出金",
  "notifications.business.deposit": "入金",
  "notifications.business.exchange": "兑换"
};

export function notificationText(key: string, params: Record<string, string | number> = {}) {
  return (messages[key] ?? key).replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match));
}
