export interface UserInfo {
  id: string;
  name: string;
  email: string;
  status?: number;
  twoFactorEnabled?: boolean;
  cryptoEnabled: boolean;
  role: { id: number; name: string } | null;
  menus: string[];
  actions: string[];
}
