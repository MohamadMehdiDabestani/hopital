// features/dashboard-admission/utils/printHelper.ts
import { formatDateWithTime } from "@/features/core";
import { statusFa } from "../const";

type Medicine = {
  id: number;
  name: string;
  count: number | null;
  chargeId: number | null;
  chargeLocation: string | null;
};

type VisitRow = {
  id: number;
  firstName: string;
  lastName: string;
  codeMeli: string;
  doctorFirstName: string;
  doctorLastName: string;
  status: string;
  receptionTime: Date | null;
  treatTime: Date | null;
  reciveMedicineTime: Date | null;
  exitRoomAt: Date | null;
  extraNotes: string;
  medicines: Medicine[] | null;
  tests: { id: number; name: string }[] | null;
};

export const generateVisitPrintHTML = (
  row: VisitRow,
  isGregorian: boolean
): string => {
  const formatDate = (date: Date | null) =>
    date ? formatDateWithTime(date, isGregorian) : "-";

  const medicinesHTML =
    row.medicines?.length
      ? `
    <table class="print-table">
      <thead>
        <tr>
          <th>#</th>
          <th>نام دارو</th>
          <th>تعداد</th>
          <th>محل شارژ</th>
        </tr>
      </thead>
      <tbody>
        ${row.medicines
          .map(
            (m, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${m.name}</td>
            <td>${m.count ?? "-"}</td>
            <td>${m.chargeLocation ?? "-"}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `
      : '<p style="font-size: 13px; color: #666;">دارویی ثبت نشده است.</p>';

  const testsHTML = row.tests?.length
    ? `
    <div class="print-section">
      <h3>آزمایش‌ها</h3>
      <table class="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>نام آزمایش</th>
          </tr>
        </thead>
        <tbody>
          ${row.tests
            .map(
              (t, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${t.name}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
    : "";

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8" />
        <title>برگه ویزیت بیمار</title>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            direction: rtl;
            padding: 32px;
            color: #000;
            margin: 0;
          }
          
          h2 {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 24px;
          }
          
          .print-section {
            margin-bottom: 20px;
          }
          
          .print-section h3 {
            font-size: 14px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
            margin-bottom: 10px;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 24px;
          }
          
          .print-field {
            display: flex;
            gap: 6px;
            font-size: 13px;
          }
          
          .print-label {
            font-weight: bold;
            white-space: nowrap;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-top: 8px;
          }
          
          .print-table th,
          .print-table td {
            border: 1px solid #999;
            padding: 6px 10px;
            text-align: right;
          }
          
          .print-table th {
            background: #f0f0f0;
          }
          
          .print-footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #555;
          }
          
          @media print {
            body { 
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <h2>برگه ویزیت بیمار</h2>

        <div class="print-section">
          <h3>اطلاعات بیمار</h3>
          <div class="print-grid">
            <div class="print-field">
              <span class="print-label">نام و نام خانوادگی:</span>
              <span>${row.firstName} ${row.lastName}</span>
            </div>
            <div class="print-field">
              <span class="print-label">کد ملی:</span>
              <span>${row.codeMeli}</span>
            </div>
          </div>
        </div>

        <div class="print-section">
          <h3>اطلاعات ویزیت</h3>
          <div class="print-grid">
            <div class="print-field">
              <span class="print-label">پزشک:</span>
              <span>${row.doctorFirstName} ${row.doctorLastName}</span>
            </div>
            <div class="print-field">
              <span class="print-label">وضعیت:</span>
              <span>${statusFa[row.status] ?? row.status}</span>
            </div>
            <div class="print-field">
              <span class="print-label">زمان پذیرش:</span>
              <span>${formatDate(row.receptionTime)}</span>
            </div>
            <div class="print-field">
              <span class="print-label">زمان ویزیت:</span>
              <span>${formatDate(row.treatTime)}</span>
            </div>
            <div class="print-field">
              <span class="print-label">زمان دریافت دارو:</span>
              <span>${formatDate(row.reciveMedicineTime)}</span>
            </div>
            <div class="print-field">
              <span class="print-label">زمان خروج از اتاق:</span>
              <span>${formatDate(row.exitRoomAt)}</span>
            </div>
          </div>
          ${
            row.extraNotes
              ? `
          <div class="print-field" style="margin-top: 8px;">
            <span class="print-label">یادداشت:</span>
            <span>${row.extraNotes}</span>
          </div>
          `
              : ""
          }
        </div>

        <div class="print-section">
          <h3>داروهای تجویز شده</h3>
          ${medicinesHTML}
        </div>

        ${testsHTML}

        <div class="print-footer">
          <span>شماره ویزیت: ${row.id}</span>
          <span>تاریخ چاپ: ${formatDate(new Date())}</span>
        </div>
      </body>
    </html>
  `;
};