import request from '../request';

export type RiskLevel = 0 | 1 | 2 | 3;
export type RiskCaseStatus = 0 | 1 | 2 | 3;
export type RiskStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface RiskActions {
  can_request_risk_supplement: boolean;
  can_clear_risk: boolean;
  can_reject_risk: boolean;
}

export interface RiskHit {
  rule_code: string;
  rule_name: string;
  risk_level: RiskLevel;
  actual_value?: string | number | null;
  threshold_value?: string | number | null;
  parameters?: Record<string, string | number>;
  description?: string | null;
}

export interface RiskAssessment {
  risk_level: RiskLevel;
  risk_status: RiskStatus;
  risk_case_id: number | null;
  risk_case_no: string | null;
  evaluated_at: string | null;
  metrics: Record<string, string | number | null> | null;
  hits: RiskHit[];
  available_actions: RiskActions;
}

export interface RiskCaseItem {
  id: number;
  case_no: string;
  status: RiskCaseStatus;
  current_supplement_request?: string | null;
  opened_at: string | null;
  closed_at: string | null;
  user: { id: number; agent_code: string; company_name: string; email: string };
  withdrawal: { id: number; order_no: string; amount: string; currency: string; status: number };
  risk_level: RiskLevel;
}

export interface RiskCaseRecord {
  id: number;
  action_type: number;
  action_name?: string;
  actor_name: string | null;
  message: string | null;
  file_ids: number[];
  files?: Array<{
    file_id?: number;
    id?: number;
    original_name?: string;
    name?: string;
    extension?: string;
    size?: number;
  }>;
  created_at: string | null;
}

export interface RiskCaseDetail extends RiskCaseItem {
  assessment: RiskAssessment;
  handled_admin?: { id: number; name: string } | null;
  decision_note?: string | null;
  records?: RiskCaseRecord[];
}

export interface RiskCaseListParams {
  status?: RiskCaseStatus;
  user_id?: number;
  keyword?: string;
  started_at?: string;
  ended_at?: string;
  page: number;
  limit: number;
}

export interface RiskRule {
  code: string;
  name: string;
  category: string;
  level: RiskLevel;
  action: string;
  parameter_types: Record<string, 'amount' | 'integer'>;
  parameters: Record<string, string | number>;
  enabled: boolean;
}

export function getWithdrawalRiskCaseList(params: RiskCaseListParams) {
  return request.get<
    unknown,
    {
      current_page: number;
      data: RiskCaseItem[];
      per_page: number;
      total: number;
      last_page: number;
    }
  >('/admin/getWithdrawalRiskCaseList', { params });
}
export function getWithdrawalRiskCaseInfo(id: number) {
  return request.get<unknown, RiskCaseDetail>('/admin/getWithdrawalRiskCaseInfo', {
    params: { id },
  });
}
export function requestWithdrawalRiskSupplement(payload: { id: number; message: string }) {
  return request.post('/admin/requestWithdrawalRiskSupplement', payload);
}
export function reviewWithdrawalRisk(payload: {
  id: number;
  decision: 'clear' | 'reject';
  note?: string;
}) {
  return request.post('/admin/reviewWithdrawalRisk', payload);
}
export function getWithdrawalRiskRuleList(currencyId: number) {
  return request.get<
    unknown,
    { currency: { id: number; code: string; name: string }; rules: RiskRule[] }
  >('/admin/getWithdrawalRiskRuleList', { params: { currency_id: currencyId } });
}
export function editWithdrawalRiskRule(payload: {
  currency_id: number;
  rule_code: string;
  parameters: Record<string, string | number>;
  enabled: boolean;
}) {
  return request.post('/admin/editWithdrawalRiskRule', payload);
}
export function previewWithdrawalRiskFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/previewWithdrawalRiskFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
    silent: true,
  });
}
export function downloadWithdrawalRiskFile(fileId: number) {
  return request.get<unknown, Blob>('/admin/downloadWithdrawalRiskFile', {
    params: { file_id: fileId },
    responseType: 'blob',
    timeout: 120_000,
    silent: true,
  });
}
