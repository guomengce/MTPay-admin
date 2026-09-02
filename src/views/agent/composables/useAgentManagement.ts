import { useDisableAccountTwoFactor } from '@/composables/useDisableAccountTwoFactor';
import { useAgentDetail } from './useAgentDetail';
import { useAgentForm } from './useAgentForm';
import { useAgentList } from './useAgentList';
import { useAgentMail } from './useAgentMail';
import { useAgentStatus } from './useAgentStatus';

/**
 * 代理賬户模塊組合入口。
 * 各功能保持獨立文件，頁面只需要調用一次並綁定返回的狀態與事件。
 */
export function useAgentManagement() {
  const list = useAgentList();
  const form = useAgentForm(list.loadAgents);
  const detail = useAgentDetail();
  const mail = useAgentMail();
  const status = useAgentStatus(list.loadAgents);

  const security = useDisableAccountTwoFactor('agent', list.loadAgents);
  return { ...security, ...list, ...form, ...detail, ...mail, ...status };
}
