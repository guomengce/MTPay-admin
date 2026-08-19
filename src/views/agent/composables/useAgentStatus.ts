import { ElMessage, ElMessageBox } from 'element-plus';
import { updateAgentStatus, type AgentAccount } from '@/api/modules/agent';

export type AgentTargetStatus = 1 | 2 | 3;

/** 代理状态：负责合法目标状态的二次确认、提交及列表刷新。 */
export function useAgentStatus(refreshList: () => Promise<void>) {
  async function changeStatus(row: AgentAccount, targetStatus: AgentTargetStatus) {
    const targetName = ({ 1: '正常', 2: '暂停', 3: '停用' } as const)[targetStatus];
    try {
      await ElMessageBox.confirm(
        `确认将“${row.company_name}”的状态修改为“${targetName}”吗？`,
        '修改代理状态',
        { type: targetStatus === 3 ? 'warning' : 'info', confirmButtonText: '确认修改' },
      );
    } catch {
      return;
    }
    await updateAgentStatus(row.id, targetStatus);
    ElMessage.success(`代理状态已修改为${targetName}`);
    await refreshList();
  }

  return { changeStatus };
}
