import request from '../request';
export type CsvModule = 'deposit' | 'exchange' | 'whitelist' | 'withdrawal';
const paths: Record<CsvModule, string> = {
  deposit: '/admin/exportDepositCsv', exchange: '/admin/exportExchangeCsv',
  whitelist: '/admin/exportWhitelistCsv', withdrawal: '/admin/exportWithdrawalCsv',
};
export interface CsvFilters { keyword?: string; status?: number; role?: number; entity_type?: number; started_at?: string; ended_at?: string }
export function exportBusinessCsv(module: CsvModule, filters: CsvFilters) {
  const params: Record<string, string> = { keyword: filters.keyword?.trim() || '' };
  if (module === 'whitelist') {
    params.role = filters.role == null ? '' : String(filters.role);
    params.entity_type = filters.entity_type == null ? '' : String(filters.entity_type);
  } else {
    params.started_at = filters.started_at || ''; params.ended_at = filters.ended_at || '';
    if (module !== 'deposit') params.status = filters.status == null ? '' : String(filters.status);
  }
  const query = new URLSearchParams(params).toString();
  return request.get<unknown, Blob>(`${paths[module]}?${query}`, { responseType: 'blob' });
}
