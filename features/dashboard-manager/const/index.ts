export const roleMapper = {
  doctor: "دکتر",
  manager: "مدیر",
  medicine: "دارو دار",
  admision: "پذیرش",
};
export const ImportExcelHeaderMap: Record<string, string> = {
  نام: "firstName",
  "نام خانوادگی": "lastName",
  "کد ملی": "codeMeli",
  "شماره موبایل": "phoneNumber",
  نقش: "role",
  وضعیت: "suspended",
};

export const PersianRoleMapper: Record<string, string> = {
  دکتر: "doctor",
  مدیر: "manager",
  "دارو دار": "medicine",
  پذیرش: "admision",
};
export const ImportExcelRoleOption = [
  { value: "doctor", label: "دکتر" },
  { value: "manager", label: "مدیر" },
  { value: "medicine", label: "دارو دار" },
  { value: "admision", label: "پذیرش" },
];
export const ImportExcelSuspendedOption = [
  { value: 1, label: "غیر فعال" },
  { value: 0, label: "فعال" },
];