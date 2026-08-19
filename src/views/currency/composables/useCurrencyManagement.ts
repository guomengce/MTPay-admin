/**
 * 币种管理页面组合入口
 * -----------------------------------------------------------------------------
 *  业务范围（依据《接口文档参数-管理端.md》）：
 *  - 列表查询、分页、筛选（keyword / status）
 *  - 详情查询（含历史收款地址）
 *  - 启用 / 禁用币种网络关系
 *  - 设置或更换平台收款地址
 *
 *  设计要点：
 *  - 状态与流程集中管理；不在组件里直接请求接口；
 *  - 列表、详情、状态操作、地址设置各自封装，函数后
 *  - 同一模块的列表 / 详情共享刷新入口，避免重复请求；
 *  - 启用、禁用、设置地址的反馈信息全部由项目请求层（request.ts）统一弹 ElMessage，
 *    本 composable 只负责流程编排，不重复弹错。
 *
 *  对应接口：
 *  - GET    /admin/getCurrencyNetworkList
 *  - GET    /admin/getCurrencyNetworkInfo
 *  - POST   /admin/editCurrencyNetworkStatus
 *  - POST   /admin/setReceivingAddress
 */
import { onMounted, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import {
  editCurrencyNetworkStatus,
  getCurrencyNetworkInfo,
  getCurrencyNetworkList,
  setReceivingAddress,
  type CurrencyNetwork,
  type CurrencyNetworkDetail,
  type CurrencyNetworkListParams,
  type CurrencyStatus,
} from '@/api/modules/currency';

/* =============================================================================
 * 内部辅助：键盘上有没有空白
 * ========================================================================== */
function hasWhitespace(value: string): boolean {
  return /\s/.test(value);
}

/* =============================================================================
 * 组合入口
 * ========================================================================== */
export function useCurrencyManagement() {
  /* ======== 列表查询 ========================================================= */

  const list = ref<CurrencyNetwork[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const limit = ref(15);
  const total = ref(0);
  const keyword = ref('');
  const status = ref<CurrencyStatus | undefined>(undefined);

  /** 真实接口拉取；参数严格按文档：keyword / status / page / limit。 */
  async function loadList() {
    loading.value = true;
    try {
      const payload: CurrencyNetworkListParams = {
        page: page.value,
        limit: limit.value,
      };
      if (keyword.value.trim()) payload.keyword = keyword.value.trim().slice(0, 100);
      if (status.value !== undefined) payload.status = status.value;

      const result = await getCurrencyNetworkList(payload);
      list.value = result.data;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  function search() {
    if (page.value !== 1) page.value = 1;
    else void loadList();
  }

  function resetFilters() {
    keyword.value = '';
    status.value = undefined;
    search();
  }

  /** 监听分页与每页大小变化 */
  function onPageChange(next: number) {
    page.value = next;
  }
  function onLimitChange(next: number) {
    limit.value = next;
  }

  /* ======== 详情查询 ========================================================= */

  const detailVisible = ref(false);
  const detailLoading = ref(false);
  const detail = ref<CurrencyNetworkDetail | null>(null);

  async function openDetail(row: CurrencyNetwork) {
    detailVisible.value = true;
    detail.value = null;
    detailLoading.value = true;
    try {
      detail.value = await getCurrencyNetworkInfo(row.id);
    } finally {
      detailLoading.value = false;
    }
  }

  function closeDetail() {
    detailVisible.value = false;
    detail.value = null;
  }

  /** 详情打开状态下重新拉详情（用于状态或地址操作成功后）。 */
  async function refreshDetailIfOpen() {
    if (!detailVisible.value || !detail.value) return;
    detailLoading.value = true;
    try {
      detail.value = await getCurrencyNetworkInfo(detail.value.id);
    } finally {
      detailLoading.value = false;
    }
  }

  /* ======== 状态修改 ========================================================= */

  /**
   * 启用 / 禁用币种网络关系
   *  - 启用前若 current_receiving_address 为空，提示并阻止调用；
   *  - 禁用前给出确认提示；
   *  - 后端业务错误由 request.ts 统一弹错；成功由本处 ElMessage 提示。
   */
  async function changeStatus(row: CurrencyNetwork) {
    const nextStatus: CurrencyStatus = row.status === 1 ? 0 : 1;
    const verb = nextStatus === 1 ? '启用' : '禁用';

    if (nextStatus === 1 && !row.current_receiving_address) {
      ElMessage.warning('启用前必须先设置收款地址');
      return;
    }
    if (nextStatus === 0) {
      try {
        await ElMessageBox.confirm(
          `确认要禁用「${row.currency.name} / ${row.network.name}」吗？禁用后该网络将无法接收入金。`,
          '禁用确认',
          {
            type: 'warning',
            confirmButtonText: '确认禁用',
            cancelButtonText: '取消',
          },
        );
      } catch {
        return;
      }
    }

    await editCurrencyNetworkStatus({ id: row.id, status: nextStatus });
    ElMessage.success(`已${verb} ${row.currency.name} / ${row.network.name}`);
    await loadList();
    await refreshDetailIfOpen();
  }

  /* ======== 收款地址设置 =================================================== */

  /**
   * 提交收款地址（设置 / 更换）。
   *  - 提交前按文档校验：address 必填、≤255、不能含空白；remark 可选、≤500；
   *  - 如果当前已存在地址，给出"旧地址将停用"的二次确认；
   *  - 校验失败直接 return；后端业务错误由 request.ts 统一弹错。
   */
  async function submitReceivingAddress(
    row: CurrencyNetwork,
    payload: { address: string; remark?: string },
  ) {
    const address = payload.address.trim();
    const remark = payload.remark?.trim();

    if (!address) {
      ElMessage.warning('请填写收款地址');
      return false;
    }
    if (address.length > 255) {
      ElMessage.warning('收款地址不可超过 255 字符');
      return false;
    }
    if (hasWhitespace(address)) {
      ElMessage.warning('收款地址不能包含空白字符');
      return false;
    }
    if (remark && remark.length > 500) {
      ElMessage.warning('备注不可超过 500 字符');
      return false;
    }

    if (row.current_receiving_address) {
      try {
        await ElMessageBox.confirm(
          '设置新地址后，旧地址将停用并保留在历史记录中，是否继续？',
          '更换收款地址',
          {
            type: 'warning',
            confirmButtonText: '确认更换',
            cancelButtonText: '取消',
          },
        );
      } catch {
        return false;
      }
    }

    await setReceivingAddress({
      currency_network_id: row.id,
      address,
      remark,
    });
    ElMessage.success(
      row.current_receiving_address
        ? `已更换 ${row.currency.name} / ${row.network.name} 收款地址`
        : `已设置 ${row.currency.name} / ${row.network.name} 收款地址`,
    );
    await loadList();
    await refreshDetailIfOpen();
    return true;
  }

  /* 分页变化才自动请求；筛选字段只在用户点击查询或重置时提交。 */
  watch(page, () => void loadList());
  watch(limit, () => {
    if (page.value !== 1) page.value = 1;
    else void loadList();
  });
  onMounted(loadList);

  return {
    // 列表
    list,
    loading,
    page,
    limit,
    total,
    keyword,
    status,
    loadList,
    search,
    resetFilters,
    onPageChange,
    onLimitChange,

    // 详情
    detailVisible,
    detailLoading,
    detail,
    openDetail,
    closeDetail,
    refreshDetailIfOpen,

    // 业务操作
    changeStatus,
    submitReceivingAddress,
  };
}
