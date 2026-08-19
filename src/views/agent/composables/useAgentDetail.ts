import { useRouter } from 'vue-router';
import type { AgentAccount } from '@/api/modules/agent';

/** 代理详情入口：详情内容较多，统一跳转独立页面。 */
export function useAgentDetail() {
  const router = useRouter();

  function openDetail(row: AgentAccount) {
    return router.push({ name: 'AgentDetail', params: { id: row.id } });
  }

  return { openDetail };
}
