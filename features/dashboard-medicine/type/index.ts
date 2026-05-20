export type Medicine = {
  id: number;
  name: string;
  form: string;
  isActive: boolean;
};

export type Charge = {
  id : number | undefined,
  medicineId: number;
  expiryDate: string;
  quantity: number;
  storageLocation: string;
  expiryAlertDays: number;
  chargeCreateAt: string;
  notes?: string;
};

export type Row = Medicine & {
  createdAt: string;
  siteId: number;
  isActive: boolean;
  charges: Charge[];
};

// import excel
export type ImportExcelParsedRow = {
  id: string;
  selected: boolean;
  data: Record<string, any>;
  validationError: string;
  isValid: boolean;
};

export type ImportExcelFilterState = {
  showOnlyEmpty: boolean;
  showOnlyErrors: boolean;
};

export type DateTimeTrigger = "shamsi" | "miladi"