import { reactive } from 'vue';
import type { RoleItem, RolePayload } from './types';

const seed: RoleItem[] = [
  { id: 1, name: '超级管理员', status: 1, permissions: ['agent.list','agent.detail','agent.create','agent.edit','agent.status','agent.export','admin.list','admin.create','admin.edit','admin.status','role.list','role.manage','deposit.list','deposit.detail','deposit.review','deposit.export','exchange.list','exchange.detail','exchange.review','exchange.export','whitelist.list','whitelist.detail','whitelist.review','whitelist.export','withdrawal.list','withdrawal.detail','withdrawal.review','withdrawal.payment','withdrawal.export','config.view','config.edit','log.list','transaction.list'], admin_count: 2, updated_at: '2026-08-29 10:30' },
  { id: 2, name: '审核专员', status: 1, permissions: ['deposit.list','deposit.detail','deposit.review','exchange.list','exchange.detail','exchange.review','whitelist.list','whitelist.detail','whitelist.review','withdrawal.list','withdrawal.detail','withdrawal.review'], admin_count: 4, updated_at: '2026-08-28 16:20' },
  { id: 3, name: '只读运营', status: 0, permissions: ['agent.list','agent.detail','deposit.list','deposit.detail','exchange.list','exchange.detail','whitelist.list','whitelist.detail','withdrawal.list','withdrawal.detail','log.list','transaction.list'], admin_count: 1, updated_at: '2026-08-26 09:15' },
];

const roles = reactive<RoleItem[]>(seed);
let nextId = 4;

export function listRoles() { return roles; }
export function getRole(id: number) { return roles.find((item) => item.id === id); }
export function saveRole(payload: RolePayload, id?: number) {
  const now = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
  if (id) {
    const index = roles.findIndex((item) => item.id === id);
    if (index >= 0) roles[index] = { ...roles[index], ...payload, updated_at: now } as RoleItem;
    return id;
  }
  const created: RoleItem = { ...payload, id: nextId++, admin_count: 0, updated_at: now };
  roles.unshift(created);
  return created.id;
}
export function removeRole(id: number) { const index = roles.findIndex((item) => item.id === id); if (index >= 0) roles.splice(index, 1); }
