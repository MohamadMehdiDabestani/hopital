export type Medicine = {
  id: number;
  name: string;
  form: string;
  isActive: boolean;
};


export type Charge = {
  chargesId: number;
  expiryDate: string;
  quantity: number;
  storageLocation: string | null;
  expiryAlertDays: number;
  chargeCreateAt: string;
};

export type Row = Medicine & {
  createdAt: string;
  siteId: number;
  isActive: boolean;
  charges: Charge[];
};