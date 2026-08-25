/** 管理端官网预约列表。 */
import request from '../request';

export interface ContactReservation {
  id: number | string;
  company_name?: string | null;
  company?: string | null;
  contact_name?: string | null;
  name?: string | null;
  contact_email?: string | null;
  email?: string | null;
  contact_phone?: string | null;
  phone?: string | null;
  business_type?: string | null;
  business_type_name?: string | null;
  currencies?: string[] | string | null;
  currency_codes?: string[] | string | null;
  required_currencies?: string[] | string | null;
  submitted_at?: string | null;
  created_at?: string | null;
  ip?: string | null;
  submit_ip?: string | null;
}

export interface ContactReservationPageResult {
  current_page: number;
  data: ContactReservation[];
  per_page: number;
  total: number;
  last_page?: number;
}

export interface ContactReservationListParams {
  page?: number;
  limit?: number;
  keyword?: string;
  started_at?: string;
  ended_at?: string;
}

export function fetchContactReservationList(params: ContactReservationListParams = {}) {
  return request.get<unknown, ContactReservationPageResult>('/admin/getContactReservationList', {
    params,
  });
}
