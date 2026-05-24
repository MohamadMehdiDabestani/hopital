export const formMedicineMapper = {
  pill: "قرص",
  cyrup: "شربت",
  oitment: "پماد",
  injection: "تزریقی",
};
export const persianToEnglishForm: Record<string, string> = {
  "قرص": "pill",
  "شربت": "cyrup",
  "تزریقی": "injection",
  "پماد": "oitment",
};

// import excel type
export const ImportExcelHeaderMap: Record<string, string> = {
  "نام دارو": "name",
  فرم: "form",
  "تاریخ ثبت": "createdAt",
  وضعیت: "isActive",
  // "وضعیت شارژ": "chargeIsActive",
  "تعداد شارژ": "chargeQuantity",
  "تاریخ ورود شارژ": "chargeCreateAt",
  "روزهای هشدار": "chargeWarningDays",
  "تاریخ انقضا شارژ": "chargeExpiryDate",
  "محل نگهداری": "chargeStorageLocation",
  "توضیحات اضافه شارژ": "chargeNotes",
};

export const ImportExcelFormOption = [
  { value: "pill", label: "قرص" },
  { value: "cyrup", label: "شربت" },
  { value: "oitment", label: "پماد" },
  { value: "injection", label: "تزریقی" },
];

export const ImportExcelStatusOption = [
  { value: 0, label: "غیر فعال" },
  { value: 1, label: "فعال" },
];
