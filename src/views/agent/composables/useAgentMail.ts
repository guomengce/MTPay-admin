import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  resendAgentInvitation,
  sendAgentPasswordReset,
  type AgentAccount,
  type MailResult,
} from '@/api/modules/agent';

export type AgentMailAction = 'invitation' | 'password-reset';
type AgentMailTarget = Pick<AgentAccount, 'id' | 'email'>;

/** 代理郵件：負責激活邀請、密碼重置郵件的確認、Loading 與結果展示。 */
export function useAgentMail() {
  const mailLoading = ref<AgentMailAction | null>(null);

  /** 接口成功不代表郵件成功，必須根據 MailResult.status 展示真實結果。 */
  function showMailResult(result: MailResult) {
    const text = result.failure_reason
      ? `${result.status_name}：${result.failure_reason}`
      : `${result.status_name}，目標郵箱：${result.to_email}`;
    if (result.status === 1) ElMessage.success(text);
    else if (result.status === 2) ElMessage.error(text);
    else ElMessage.info(text);
  }

  async function sendInvitation(agent: AgentMailTarget) {
    try {
      await ElMessageBox.confirm(`確認重新發送激活郵件到 ${agent.email} 嗎？`, '重新發送激活郵件', {
        type: 'warning',
        confirmButtonText: '確認發送',
      });
    } catch {
      return;
    }
    mailLoading.value = 'invitation';
    try {
      showMailResult(await resendAgentInvitation(agent.id));
    } finally {
      mailLoading.value = null;
    }
  }

  async function sendPasswordReset(agent: AgentMailTarget) {
    try {
      await ElMessageBox.confirm(`確認發送密碼重置郵件到 ${agent.email} 嗎？`, '發送密碼重置郵件', {
        type: 'info',
        confirmButtonText: '確認發送',
      });
    } catch {
      return;
    }
    mailLoading.value = 'password-reset';
    try {
      showMailResult(await sendAgentPasswordReset(agent.id));
    } finally {
      mailLoading.value = null;
    }
  }

  return { mailLoading, sendInvitation, sendPasswordReset };
}
