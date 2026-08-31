const routes: Record<string, string> = {
  deposit: 'DepositDetail', fiat_deposit: 'FiatDepositDetail', exchange: 'ExchangeDetail', withdrawal: 'WithdrawalDetail', whitelist: 'WhitelistDetail',
};

export function businessDetailRoute(row: { detail_type?: string; detail_id?: number; business_type: string; business_id: number }) {
  const type = row.detail_type ?? row.business_type;
  const id = row.detail_type ? row.detail_id : row.business_id;
  if ((type === 'manual_increase' || type === 'manual_decrease') && Number.isInteger(id) && Number(id) > 0) {
    return { name: 'ManualAdjustmentDetail', params: { type, id: id! } };
  }
  const name = Object.prototype.hasOwnProperty.call(routes, type) ? routes[type] : undefined;
  return name && Number.isInteger(id) && Number(id) > 0 ? { name, params: { id: id! } } : null;
}
