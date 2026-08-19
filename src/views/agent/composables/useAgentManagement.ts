import { useAgentDetail } from './useAgentDetail';
import { useAgentForm } from './useAgentForm';
import { useAgentList } from './useAgentList';
import { useAgentStatus } from './useAgentStatus';

/**
 * 代理账户模块组合入口。
 * 各功能保持独立文件，页面只需要调用一次并绑定返回的状态与事件。
 */
export function useAgentManagement() {
  const list = useAgentList();
  const form = useAgentForm(list.loadAgents);
  const detail = useAgentDetail();
  const status = useAgentStatus(list.loadAgents);

  return { ...list, ...form, ...detail, ...status };
}
