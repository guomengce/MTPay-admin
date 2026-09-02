const messages: Record<string, string> = {
 'twoFactorSettings.title': '雙重驗證（2FA）', 'twoFactorSettings.enabled': '已開啓', 'twoFactorSettings.disabled': '未開啓',
 'twoFactorSettings.failed': '操作失敗，請重試', 'twoFactorSettings.retry': '重新獲取狀態', 'twoFactorSettings.qrCode': '2FA 綁定二維碼',
 'twoFactorSettings.manualKey': '手動設定金鑰', 'twoFactorSettings.manualKeyCopied': '2FA 手動設定金鑰已複製', 'twoFactorSettings.manualKeyCopyFailed': '複製失敗，請手動複製', 'common.actions.copy': '複製',
 'twoFactorSettings.code': '六位動態驗證碼', 'twoFactor.codeInvalid': '請輸入六位數字驗證碼',
 'twoFactorSettings.confirmDisable': '確認關閉', 'twoFactorSettings.confirm': '確認開啓', 'common.actions.cancel': '取消',
 'twoFactorSettings.start': '開啓 2FA', 'twoFactorSettings.disable': '關閉 2FA',
 'twoFactorSettings.disableWarning': '關閉雙重驗證會降低賬户安全性，確定繼續嗎？',
 'twoFactorSettings.restricted': '此管理員賬户不支持開啓 2FA',
};
export function accountText(key: string) { return messages[key] || key; }
