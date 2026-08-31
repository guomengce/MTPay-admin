import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { exportBusinessCsv, type CsvModule, type CsvFilters } from '@/api/modules/csvExport';
export function useBusinessCsvExport(module: CsvModule, filters: () => CsvFilters | null) {
  const exporting = ref(false);
  async function downloadCsv() {
    if (exporting.value) return;
    const applied = filters();
    if (!applied) { ElMessage.warning('請先查詢列表後再匯出'); return; }
    const snapshot = { ...applied };
    if (snapshot.started_at && snapshot.ended_at && snapshot.started_at > snapshot.ended_at) {
      ElMessage.error('開始日期不能晚於結束日期'); return;
    }
    exporting.value = true;
    try {
      const blob = await exportBusinessCsv(module, snapshot);
      if (!(blob instanceof Blob) || /json|html/i.test(blob.type)) throw Error('導出失敗：未收到 CSV 文件');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `${module}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { ElMessage.error(error instanceof Error ? error.message : '導出失敗'); }
    finally { exporting.value = false; }
  }
  return { exporting, downloadCsv };
}
