import type { ContactReservation } from '@/api/modules/reservation';

export interface ReservationRow {
  key: string;
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: string;
  currencies: string[];
  submittedAt: string;
  ip: string;
}

function text(...values: unknown[]) {
  const value = values.find((item) => item !== undefined && item !== null && String(item).trim());
  return value === undefined ? '—' : String(value).trim();
}

function currencyList(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (!value) return [];
  return String(value).split(/[,，/|·\s]+/).map((item) => item.trim()).filter(Boolean);
}

export function toReservationRow(item: ContactReservation): ReservationRow {
  const id = text(item.id);
  return {
    key: id,
    id,
    company: text(item.company_name, item.company),
    contactName: text(item.contact_name, item.name),
    email: text(item.contact_email, item.email),
    phone: text(item.contact_phone, item.phone),
    businessType: text(item.business_type_name, item.business_type),
    currencies: currencyList(item.currency_codes ?? item.required_currencies ?? item.currencies),
    submittedAt: text(item.submitted_at, item.created_at),
    ip: text(item.submit_ip, item.ip),
  };
}
