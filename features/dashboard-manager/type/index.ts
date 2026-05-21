export type UserRow = {
  id: number;
  firstName: string;
  lastName: string;
  codeMeli: string;
  phone: string;
  lastLoginAt: string;
  role: string;
  suspended: boolean;
};
export type ApiResult = {
  total: number;
  rows: UserRow[];
};
