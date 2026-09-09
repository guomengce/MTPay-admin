import { h, ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  resendAgentInvitation,
  sendAgentPasswordReset,
  type AgentAccount,
  type MailResult,
} from '@/api/modules/agent';
import { confirmAdminAction } from '@/utils/adminMessageBox';

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
    const confirmed = await confirmAdminAction({
      title: '重新發送激活郵件',
      message: mailConfirmMessage('確認重新發送激活郵件到', agent.email),
      confirmText: '確認發送',
    });
    if (!confirmed) return;
    mailLoading.value = 'invitation';
    try {
      showMailResult(await resendAgentInvitation(agent.id));
    } finally {
      mailLoading.value = null;
    }
  }

  async function sendPasswordReset(agent: AgentMailTarget) {
    const confirmed = await confirmAdminAction({
      title: '發送密碼重置郵件',
      message: mailConfirmMessage('確認發送密碼重置郵件到', agent.email),
      confirmText: '確認發送',
    });
    if (!confirmed) return;
    mailLoading.value = 'password-reset';
    try {
      showMailResult(await sendAgentPasswordReset(agent.id));
    } finally {
      mailLoading.value = null;
    }
  }

  return { mailLoading, sendInvitation, sendPasswordReset };
}

function mailConfirmMessage(prefix: string, email: string) {
  return h('span', [
    `${prefix} `,
    h('strong', { class: 'admin-message-box__variable' }, email),
    ' 嗎？',
  ]);
}
