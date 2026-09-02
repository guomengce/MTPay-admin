import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  createAgent,
  fetchAgentInfoForEdit,
  updateAgent,
  type AgentAccount,
  type AgentFormPayload,
} from '@/api/modules/agent';

/** 代理表單：負責新增、修改前詳情回填、提交狀態及成功後的列表刷新。 */
export function useAgentForm(refreshList: () => Promise<void>) {
  const formVisible = ref(false);
  const submitting = ref(false);
  const editingAgent = ref<AgentAccount | null>(null);

  function openCreate() {
    editingAgent.value = null;
    formVisible.value = true;
  }

  /** 修改前讀取最新詳情，避免直接使用可能過期的列表資料。 */
  async function openEdit(row: AgentAccount) {
    editingAgent.value = await fetchAgentInfoForEdit(row.id);
    formVisible.value = true;
  }

  /** 根據 editingAgent 判斷新增或修改，不在頁面組件中調用接口。 */
  async function submitForm(form: AgentFormPayload) {
    submitting.value = true;
    try {
      if (editingAgent.value) {
        await updateAgent({ id: editingAgent.value.id, ...form });
        ElMessage.success('代理資料修改成功');
      } else {
        await createAgent(form);
        ElMessage.success('代理新增成功，激活邀請已由後端處理');
      }
      formVisible.value = false;
      await refreshList();
    } finally {
      submitting.value = false;
    }
  }

  return { formVisible, submitting, editingAgent, openCreate, openEdit, submitForm };
}
