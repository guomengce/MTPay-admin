import { useRouter } from 'vue-router';
import type { AgentAccount } from '@/api/modules/agent';

/** 代理詳情入口：詳情內容較多，統一跳轉獨立頁面。 */
export function useAgentDetail() {
  const router = useRouter();

  function openDetail(row: AgentAccount) {
    return router.push({ name: 'AgentDetail', params: { id: row.id } });
  }

  return { openDetail };
}
