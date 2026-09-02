/**
 * API 通用類型定義
 * -----------------------------------------------------------------------------
 * 這些類型是各業務模塊接口文件的"公共底盤"，儘量保持穩定。
 */

/** 業務信封：所有接口約定的返回結構 */
export interface ApiResponse<T = unknown> {
  status: number | string;
  message: string;
  data: T;
  is_popup?: boolean;
  sign?: string;
}

/** 通用分頁請求參數 */
export interface PageParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  /** 通用過濾項，自由擴展 */
  [key: string]: unknown;
}

/** 通用分頁結果 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 通用下拉選項 */
export interface OptionItem<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** 通用 ID 類型：業務側 id 多數為字符串 */
export type Id = string;

/** 時間字符串：統一 ISO 8601（後端原樣返回）*/
export type ISODateString = string;

/** 通用 CRUD 標識 payload */
export interface IdPayload {
  id: Id;
}

/** 異步執行結果包裝，用於 composable 內不拋異常的場景 */
export type AsyncResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: Error };
