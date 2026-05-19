export const formMedicineMapper = {
  pill: "قرص",
  cyrup: "شربت",
  oitment: "پماد",
  injection: "تزریقی",
};

// import excel type
export const ImportExcelHeaderMap: Record<string, string> = {
  "نام دارو": "name",
  فرم: "form",
  "تاریخ ثبت": "createdAt",
  وضعیت: "isActive",
  "وضعیت شارژ": "chargeIsActive",
  "تعداد شارژ": "chargeQuantity",
  "تاریخ ورود شارژ": "chargeCreateAt",
  "روزهای هشدار": "chargeWarningDays",
  "تاریخ انقضاشارژ": "chargeExpiryDate",
  "محل نگهداری": "chargeStorageLocation",
  "توضیحات اضافه شارژ": "chargeNotes",
};

export const ImportExcelFormOption = [
  { value: "قرص", label: "قرص" },
  { value: "شربت", label: "شربت" },
  { value: "پماد", label: "پماد" },
  { value: "تزریقی", label: "تزریقی" },
];

export const ImportExcelStatusOption = [
  { value: "غیر فعال", label: "غیر فعال" },
  { value: "فعال", label: "فعال" },
];
