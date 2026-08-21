/**
 * 统一交易详情数据层
 * -----------------------------------------------------------------------------
 * - 负责调用 GET /admin/getTransactionInfo；
 * - 维护 loading / detail / 错误状态；
 * - 校验路由参数 business_type 和 business_id；
 * - 监听路由参数变化重新加载，并防止旧请求结果覆盖新请求。
 */
import { onBeforeUnmount, ref, watch } from 'vue';
import type { Ref } from 'vue';

import * as TransactionApi from '@/api/modules/transaction';
import type {
  TransactionBusinessType,
  TransactionDetail,
  TransactionInfoResult,
  TransactionItem,
} from '@/api/modules/transaction';

const VALID_BUSINESS_TYPES: ReadonlyArray<TransactionBusinessType> = [
  'deposit',
  'exchange',
  'withdrawal',
];

export interface TransactionDetailState {
  transaction: TransactionItem;
  detail: TransactionDetail;
}

export interface UseTransactionDetailResult {
  loading: Ref<boolean>;
  info: Ref<TransactionDetailState | null>;
  invalid: Ref<boolean>;
  reload: () => Promise<void>;
}

export function useTransactionDetail(
  businessTypeRef: Ref<TransactionBusinessType | string | undefined>,
  businessIdRef: Ref<string | number | undefined>,
): UseTransactionDetailResult {
  const loading = ref(false);
  const info = ref<TransactionDetailState | null>(null);
  const invalid = ref(false);

  /** 用于让旧请求的响应不再写入当前状态，避免快速切换业务导致结果错乱。 */
  let currentToken = 0;

  function readBusinessType(raw: unknown): TransactionBusinessType | null {
    if (typeof raw !== 'string') return null;
    return (VALID_BUSINESS_TYPES as ReadonlyArray<string>).includes(raw)
      ? (raw as TransactionBusinessType)
      : null;
  }

  function readBusinessId(raw: unknown): number | null {
    const value = typeof raw === 'string' ? Number(raw) : Number(raw);
    if (!Number.isInteger(value) || value <= 0) return null;
    return value;
  }

  async function reload() {
    const businessType = readBusinessType(businessTypeRef.value);
    const businessId = readBusinessId(businessIdRef.value);
    if (!businessType || !businessId) {
      invalid.value = true;
      info.value = null;
      return;
    }

    invalid.value = false;
    const token = ++currentToken;
    loading.value = true;
    try {
      const result: TransactionInfoResult =
        await TransactionApi.fetchTransactionInfo({
          business_type: businessType,
          business_id: businessId,
        });
      // 仅在最新请求时写入，避免旧请求覆盖新数据
      if (token !== currentToken) return;
      info.value = {
        transaction: result.transaction,
        detail: result.detail,
      };
    } catch {
      // 统一请求层已经展示错误提示；此处只清空当前展示，保持返回按钮可用。
      if (token !== currentToken) return;
      info.value = null;
    } finally {
      if (token === currentToken) loading.value = false;
    }
  }

  watch(
    () => [businessTypeRef.value, businessIdRef.value],
    () => {
      void reload();
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    currentToken += 1;
  });

  return { loading, info, invalid, reload };
}