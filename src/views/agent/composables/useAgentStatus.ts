import { ElMessage, ElMessageBox } from 'element-plus';
import { updateAgentStatus, type AgentAccount } from '@/api/modules/agent';

export type AgentTargetStatus = 1 | 2;

/** 代理狀態：負責合法目標狀態的二次確認、提交及列表刷新。 */
export function useAgentStatus(refreshList: () => Promise<void>) {
  async function changeStatus(row: AgentAccount, targetStatus: AgentTargetStatus) {
    const targetName = ({ 1: '正常', 2: '凍結' } as const)[targetStatus];
    try {
      await ElMessageBox.confirm(
        `確認將“${row.company_name}”的狀態修改為“${targetName}”嗎？`,
        '修改代理狀態',
        { type: 'info', confirmButtonText: '確認修改' },
      );
    } catch {
      return;
    }
    await updateAgentStatus(row.id, targetStatus);
    ElMessage.success(`代理狀態已修改為${targetName}`);
    await refreshList();
  }

  return { changeStatus };
}
