/**
 * 币种管理 API
 * -----------------------------------------------------------------------------
 * 对应《接口文档参数-管理端.md》7.5 币种管理与业务配置。
 *
 * 业务约束：
 *  - 币种、网络、币种网络关系由后端 migration 初始化，管理端不可增删改基础资料。
 *  - 管理端只允许：
 *      1. 查看币种网络关系列表
 *      2. 查看详情（含当前收款地址 + 历史收款地址）
 *      3. 启用 / 禁用币种网络关系
 *      4. 设置或更换平台收款地址（旧地址由后端停用并保留历史记录）
 *  - 收款地址设置成功后由后端处理旧地址；前端不能删除历史地址。
 *
 * 列表入参严格只用 keyword、status、page、limit；
 * 禁止 sort_field / sort_order / name / code / network_id 等扩展字段。
 */
import request from '../request';

/* =============================================================================
 * 类型定义
 * ========================================================================== */

/** 通用状态：0 禁用 / 1 启用 */
export type CurrencyStatus = 0 | 1;

/** 列表 / 详情公共字段：币种基础资料 */
export interface CurrencyRef {
  id: number;
  code: string;
  name: string;
  type: number;
  status: CurrencyStatus;
}

/** 列表 / 详情公共字段：网络基础资料 */
export interface NetworkRef {
  id: number;
  code: string;
  name: string;
  status: CurrencyStatus;
}

/** 当前生效收款地址 */
export interface CurrentReceivingAddress {
  id: number;
  address: string;
  remark: string | null;
  status: CurrencyStatus;
  activated_at: string;
}

/** 历史收款地址（含当前正在使用）*/
export interface ReceivingAddress {
  id: number;
  currency_network_id: number;
  currency: CurrencyRef;
  network: NetworkRef;
  address: string;
  remark: string | null;
  status: CurrencyStatus;
  status_name: string;
  is_effective: boolean;
  activated_at: string;
  deactivated_at: string | null;
  created_at: string;
  updated_at: string;
}

/** 列表 / 详情主体 */
export interface CurrencyNetwork {
  id: number;
  currency: CurrencyRef;
  network: NetworkRef;
  status: CurrencyStatus;
  status_name: string;
  is_effective: boolean;
  current_receiving_address: CurrentReceivingAddress | null;
  created_at: string;
  updated_at: string;
}

/** 详情：列表基础上额外包含历史地址 */
export interface CurrencyNetworkDetail extends CurrencyNetwork {
  receiving_addresses: ReceivingAddress[];
}

/* =============================================================================
 * 列表入参 / 响应
 * ========================================================================== */

/**
 * 列表查询参数
 *  - keyword 可选，最大 100 字符
 *  - status 可选，仅 0 / 1
 *  - page / limit 必填正整数，limit 字段名（不要 pageSize）
 */
export interface CurrencyNetworkListParams {
  keyword?: string;
  status?: CurrencyStatus;
  page: number;
  limit: number;
}

/**
 * Laravel 分页响应。request.ts 只解包业务信封，列表仍从 data 读取。
 */
export interface CurrencyNetworkListResult {
  current_page: number;
  data: CurrencyNetwork[];
  per_page: number;
  total: number;
  last_page: number;
}

/* =============================================================================
 * 接口实现
 * ========================================================================== */

/**
 * 获取币种网络关系列表
 * GET /admin/getCurrencyNetworkList
 * 仅支持 keyword、status、page、limit，禁止传递额外排序参数。
 */
export function getCurrencyNetworkList(params: CurrencyNetworkListParams) {
  return request.get<unknown, CurrencyNetworkListResult>('/admin/getCurrencyNetworkList', {
    params,
  });
}

/**
 * 获取币种网络关系详情
 * GET /admin/getCurrencyNetworkInfo
 * id 必须是正整数；详情返回 CurrencyNetwork 并额外包含 receiving_addresses。
 */
export function getCurrencyNetworkInfo(id: number) {
  return request.get<unknown, CurrencyNetworkDetail>('/admin/getCurrencyNetworkInfo', {
    params: { id },
  });
}

/**
 * 修改币种网络关系状态
 * POST /admin/editCurrencyNetworkStatus
 *  - status=1 启用；status=0 禁用
 *  - 启用前必须已存在有效收款地址，否则由后端返回业务错误；前端不能擅自伪造成功
 */
export function editCurrencyNetworkStatus(payload: { id: number; status: CurrencyStatus }) {
  return request.post<unknown, CurrencyNetwork>('/admin/editCurrencyNetworkStatus', payload);
}

/**
 * 设置或更换平台收款地址
 * POST /admin/setReceivingAddress
 *  - currency_network_id：正整数
 *  - address：必填，≤255 字符，不能含空白
 *  - remark：可选，≤500 字符
 *  - 旧地址由后端停用，前端不能删除
 */
export function setReceivingAddress(payload: {
  currency_network_id: number;
  address: string;
  remark?: string;
}) {
  return request.post<unknown, ReceivingAddress>('/admin/setReceivingAddress', payload);
}
