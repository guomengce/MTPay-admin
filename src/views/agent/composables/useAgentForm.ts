import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {
  createAgent,
  fetchAgentInfoForEdit,
  updateAgent,
  type AgentAccount,
  type AgentFormPayload,
} from '@/api/modules/agent';

/** 代理表单：负责新增、修改前详情回填、提交状态及成功后的列表刷新。 */
export function useAgentForm(refreshList: () => Promise<void>) {
  const formVisible = ref(false);
  const submitting = ref(false);
  const editingAgent = ref<AgentAccount | null>(null);

  function openCreate() {
    editingAgent.value = null;
    formVisible.value = true;
  }

  /** 修改前读取最新详情，避免直接使用可能过期的列表资料。 */
  async function openEdit(row: AgentAccount) {
    editingAgent.value = await fetchAgentInfoForEdit(row.id);
    formVisible.value = true;
  }

  /** 根据 editingAgent 判断新增或修改，不在页面组件中调用接口。 */
  async function submitForm(form: AgentFormPayload) {
    submitting.value = true;
    try {
      if (editingAgent.value) {
        await updateAgent({ id: editingAgent.value.id, ...form });
        ElMessage.success('代理资料修改成功');
      } else {
        await createAgent(form);
        ElMessage.success('代理新增成功，激活邀请已由后端处理');
      }
      formVisible.value = false;
      await refreshList();
    } finally {
      submitting.value = false;
    }
  }

  return { formVisible, submitting, editingAgent, openCreate, openEdit, submitForm };
}
