export type SiteRow = {
  id: number;
  siteName: string;
  user: {
    createdByUserId?: string;
    firstName: string;
    lastName: string;
    codeMeli: string;
    phone: string;
    lastLoginAt: string;
    suspended: boolean;
  };
};
export type ApiResponse = {
  rows: SiteRow[];
  total: number;
};