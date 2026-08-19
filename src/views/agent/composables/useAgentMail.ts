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

/** 代理邮件：负责激活邀请、密码重置邮件的确认、Loading 与结果展示。 */
export function useAgentMail() {
  const mailLoading = ref<AgentMailAction | null>(null);

  /** 接口成功不代表邮件成功，必须根据 MailResult.status 展示真实结果。 */
  function showMailResult(result: MailResult) {
    const text = result.failure_reason
      ? `${result.status_name}：${result.failure_reason}`
      : `${result.status_name}，目标邮箱：${result.to_email}`;
    if (result.status === 1) ElMessage.success(text);
    else if (result.status === 2) ElMessage.error(text);
    else ElMessage.info(text);
  }

  async function sendInvitation(agent: AgentMailTarget) {
    try {
      await ElMessageBox.confirm(`确认重新发送激活邮件到 ${agent.email} 吗？`, '重新发送激活邮件', {
        type: 'warning',
        confirmButtonText: '确认发送',
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
      await ElMessageBox.confirm(`确认发送密码重置邮件到 ${agent.email} 吗？`, '发送密码重置邮件', {
        type: 'info',
        confirmButtonText: '确认发送',
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
