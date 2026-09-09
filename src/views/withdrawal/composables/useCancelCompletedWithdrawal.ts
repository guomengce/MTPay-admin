import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { cancelCompletedWithdrawal } from '@/api/modules/withdrawal';
import { promptAdminAction } from '@/utils/adminMessageBox';
export function useCancelCompletedWithdrawal(refresh: () => Promise<unknown>) {
  const cancelling = ref(false);
  async function cancelCompleted(row: { businessId: number; id: string; statusCode: number }) {
    if (
      cancelling.value ||
      row.statusCode !== 3 ||
      !Number.isInteger(row.businessId) ||
      row.businessId <= 0
    )
      return;
    const reason = await promptAdminAction({
      title: '取消已完成法幣出金',
      label: '取消原因（選填）',
      placeholder: '請輸入取消原因',
      confirmText: '確認取消',
      cancelText: '返回',
    });
    if (reason === null) return;

    cancelling.value = true;
    try {
      await cancelCompletedWithdrawal(row.businessId, reason);
      ElMessage.success('法幣出金訂單已取消');
      await refresh();
    } catch {
      /* Backend errors are displayed by the request layer; do not retry mutations. */
    } finally {
      cancelling.value = false;
    }
  }
  return { cancelling, cancelCompleted };
}
