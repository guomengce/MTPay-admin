import { ref } from 'vue';
import { ElMessage } from 'element-plus';

export interface CsvColumn<T> {
  label: string;
  value: keyof T | ((row: T) => unknown);
}

interface PageResult<T> {
  data: T[];
  total: number;
  last_page?: number;
}

function csvCell(value: unknown) {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function useCsvExport() {
  const exporting = ref(false);

  async function exportPagedCsv<T>(options: {
    filename: string;
    columns: CsvColumn<T>[];
    fetchPage: (page: number, limit: number) => Promise<PageResult<T>>;
  }) {
    if (exporting.value) return;
    exporting.value = true;
    try {
      const limit = 200;
      const rows: T[] = [];
      let page = 1;
      let total = 0;
      let lastPage = 1;
      do {
        const result = await options.fetchPage(page, limit);
        rows.push(...(result.data || []));
        total = result.total || 0;
        lastPage = result.last_page || Math.max(1, Math.ceil(total / limit));
        page += 1;
      } while (page <= lastPage && rows.length < total);

      if (!rows.length) {
        ElMessage.warning('目前篩選條件下沒有可匯出的訂單');
        return;
      }

      const lines = [
        options.columns.map((column) => csvCell(column.label)).join(','),
        ...rows.map((row) =>
          options.columns
            .map((column) => csvCell(typeof column.value === 'function' ? column.value(row) : row[column.value]))
            .join(','),
        ),
      ];
      const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${options.filename}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      ElMessage.success(`已匯出 ${rows.length} 筆訂單`);
    } finally {
      exporting.value = false;
    }
  }

  return { exporting, exportPagedCsv };
}
