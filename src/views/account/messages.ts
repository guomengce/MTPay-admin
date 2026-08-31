const messages: Record<string, string> = {
 'twoFactorSettings.title': '双重验证（2FA）', 'twoFactorSettings.enabled': '已开启', 'twoFactorSettings.disabled': '未开启',
 'twoFactorSettings.failed': '操作失败，请重试', 'twoFactorSettings.retry': '重新获取状态', 'twoFactorSettings.qrCode': '2FA 绑定二维码',
 'twoFactorSettings.code': '六位动态验证码', 'twoFactor.codeInvalid': '请输入六位数字验证码',
 'twoFactorSettings.confirmDisable': '确认关闭', 'twoFactorSettings.confirm': '确认开启', 'common.actions.cancel': '取消',
 'twoFactorSettings.start': '开启 2FA', 'twoFactorSettings.disable': '关闭 2FA',
 'twoFactorSettings.disableWarning': '关闭双重验证会降低账户安全性，确定继续吗？',
 'twoFactorSettings.restricted': '此管理员账户不支持开启 2FA',
};
export function accountText(key: string) { return messages[key] || key; }
