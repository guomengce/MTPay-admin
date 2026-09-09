import { ElMessage } from 'element-plus';
import { h } from 'vue';
import { updateAgentStatus, type AgentAccount } from '@/api/modules/agent';
import { confirmAdminAction } from '@/utils/adminMessageBox';

export type AgentTargetStatus = 1 | 2;

/** 代理狀態：負責合法目標狀態的二次確認、提交及列表刷新。 */
export function useAgentStatus(refreshList: () => Promise<void>) {
  async function changeStatus(row: AgentAccount, targetStatus: AgentTargetStatus) {
    const targetName = ({ 1: '正常', 2: '凍結' } as const)[targetStatus];
    const confirmed = await confirmAdminAction({
      title: '修改代理狀態',
      message: h('span', [
          '確認將「',
          h('strong', { class: 'admin-message-box__variable' }, row.company_name),
          '」設為「',
          h('strong', { class: 'admin-message-box__variable' }, targetName),
          '」嗎？',
      ]),
      confirmText: targetStatus === 2 ? '確認凍結' : '恢復正常',
    });
    if (!confirmed) return;
    await updateAgentStatus(row.id, targetStatus);
    ElMessage.success(`代理狀態已修改為${targetName}`);
    await refreshList();
  }

  return { changeStatus };
}
