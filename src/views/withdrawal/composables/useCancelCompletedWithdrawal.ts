import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { cancelCompletedWithdrawal } from '@/api/modules/withdrawal';
export function useCancelCompletedWithdrawal(refresh: () => Promise<unknown>) {
  const cancelling = ref(false);
  async function cancelCompleted(row: { businessId: number; id: string; statusCode: number }) {
    if (cancelling.value || row.statusCode !== 3 || !Number.isInteger(row.businessId) || row.businessId <= 0) return;
    cancelling.value = true;
    try {
      let reason: string;
      try {
        const result = await ElMessageBox.prompt(`確定取消已完成的出金訂單「${row.id}」？請核實後再操作。`, '取消已完成出金', {
          type: 'warning', inputType: 'textarea', inputPlaceholder: '取消原因（選填）',
          confirmButtonText: '確認取消出金', cancelButtonText: '返回', closeOnClickModal: false,
        });
        reason = result.value || '';
      } catch { return; }
      await cancelCompletedWithdrawal(row.businessId, reason);
      ElMessage.success('出金訂單已取消');
      await refresh();
    } catch { /* Backend errors are displayed by the request layer; do not retry mutations. */ }
    finally { cancelling.value = false; }
  }
  return { cancelling, cancelCompleted };
}
