export type SiteRow = {
  id: number;
  siteName: string;
  user: {
    userId?: string;
    firstName: string;
    lastName: string;
    codeMeli: string;
    phone: string;
    lastLoginAt: string;
    suspended: boolean;
  };
};
