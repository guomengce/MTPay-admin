export interface RoleItem {
  id: number;
  name: string;
  status: 0 | 1;
  permissions: string[];
  admin_count: number;
  updated_at: string;
}

export type RolePayload = Omit<RoleItem, 'id' | 'admin_count' | 'updated_at'>;

export interface PermissionAction { key: string; label: string }
export interface PermissionGroup { key: string; label: string; icon: string; actions: PermissionAction[] }
