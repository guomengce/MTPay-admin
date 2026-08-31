import type { PermissionGroup } from './types';

export const permissionCatalog: PermissionGroup[] = [
  { key: 'agent', label: '代理账户', icon: 'User', actions: [{ key: 'agent.list', label: '列表查看' }, { key: 'agent.detail', label: '详情查看' }, { key: 'agent.create', label: '新增代理' }, { key: 'agent.edit', label: '编辑代理' }, { key: 'agent.status', label: '修改状态' }, { key: 'agent.export', label: '数据导出' }] },
  { key: 'access', label: '权限管理', icon: 'Lock', actions: [{ key: 'admin.list', label: '管理员查看' }, { key: 'admin.create', label: '新增管理员' }, { key: 'admin.edit', label: '编辑管理员' }, { key: 'admin.status', label: '修改管理员状态' }, { key: 'role.list', label: '角色查看' }, { key: 'role.manage', label: '角色配置' }] },
  { key: 'deposit', label: '入金管理', icon: 'Wallet', actions: [{ key: 'deposit.list', label: '列表查看' }, { key: 'deposit.detail', label: '详情查看' }, { key: 'deposit.review', label: '审核入金' }, { key: 'deposit.export', label: '数据导出' }] },
  { key: 'exchange', label: '兑换管理', icon: 'Switch', actions: [{ key: 'exchange.list', label: '列表查看' }, { key: 'exchange.detail', label: '详情查看' }, { key: 'exchange.review', label: '审核兑换' }, { key: 'exchange.export', label: '数据导出' }] },
  { key: 'whitelist', label: '白名单管理', icon: 'Postcard', actions: [{ key: 'whitelist.list', label: '列表查看' }, { key: 'whitelist.detail', label: '详情查看' }, { key: 'whitelist.review', label: '审核白名单' }, { key: 'whitelist.export', label: '数据导出' }] },
  { key: 'withdrawal', label: '出金管理', icon: 'Upload', actions: [{ key: 'withdrawal.list', label: '列表查看' }, { key: 'withdrawal.detail', label: '详情查看' }, { key: 'withdrawal.review', label: '审核出金' }, { key: 'withdrawal.payment', label: '登记付款' }, { key: 'withdrawal.export', label: '数据导出' }] },
  { key: 'system', label: '系统与日志', icon: 'Setting', actions: [{ key: 'config.view', label: '配置查看' }, { key: 'config.edit', label: '修改配置' }, { key: 'log.list', label: '操作日志查看' }, { key: 'transaction.list', label: '交易记录查看' }] },
];
