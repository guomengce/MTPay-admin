/**
 * API 通用类型定义
 * -----------------------------------------------------------------------------
 * 这些类型是各业务模块接口文件的"公共底盘"，尽量保持稳定。
 */

/** 业务信封：所有接口约定的返回结构 */
export interface ApiResponse<T = unknown> {
  status: number | string;
  message: string;
  data: T;
  is_popup?: boolean;
  sign?: string;
}

/** 通用分页请求参数 */
export interface PageParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  /** 通用过滤项，自由扩展 */
  [key: string]: unknown;
}

/** 通用分页结果 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 通用下拉选项 */
export interface OptionItem<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** 通用 ID 类型：业务侧 id 多数为字符串 */
export type Id = string;

/** 时间字符串：统一 ISO 8601（后端原样返回）*/
export type ISODateString = string;

/** 通用 CRUD 标识 payload */
export interface IdPayload {
  id: Id;
}

/** 异步执行结果包装，用于 composable 内不抛异常的场景 */
export type AsyncResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: Error };
