
import { DashboardMedicineList } from "@/features/dashboard-medicine";

export const drugs = [
  { id: 1, name: "آموکسی‌سیلین ۵۰۰", warnDays: 10, location: "قفسه A" },
  { id: 2, name: "استامینوفن ۵۰۰", warnDays: 10, location: "قفسه B" },
  { id: 3, name: "ایبوپروفن ۴۰۰", warnDays: 14, location: "قفسه B" },
  { id: 4, name: "سفیکسیم ۴۰۰", warnDays: 12, location: "یخچال" },
  { id: 5, name: "متفورمین ۵۰۰", warnDays: 20, location: "قفسه C" },
  { id: 6, name: "دارو ی تست", warnDays: 20, location: "قفسه C" },
];

export const charges = [
  // drugId = 1
  { id: 101, drugId: 1, qty: 120, expireDate: "2026/06/10", entryDate: "2026/02/01" },
  { id: 102, drugId: 1, qty: 80,  expireDate: "2026/04/20", entryDate: "2026/03/12" },

  // drugId = 2
  { id: 201, drugId: 2, qty: 200, expireDate: "2026/05/05", entryDate: "2026/02/15" },

  // drugId = 3
  { id: 301, drugId: 3, qty: 90,  expireDate: "2026/07/01", entryDate: "2026/03/20" },
  { id: 302, drugId: 3, qty: 60,  expireDate: "2026/04/18", entryDate: "2026/04/01" },

  // drugId = 4
  { id: 401, drugId: 4, qty: 50,  expireDate: "2026/05/15", entryDate: "2026/03/05" },

  // drugId = 5
  { id: 501, drugId: 5, qty: 300, expireDate: "2026/12/30", entryDate: "2026/01/10" },
];

export default function DashboardMedicine() {
    return(<DashboardMedicineList charges={charges} drugs={drugs} />)
}