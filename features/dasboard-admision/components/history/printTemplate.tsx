// features/dashboard-admission/components/VisitPrintTemplate.tsx
"use client";

import { forwardRef } from "react";
import { formatDateWithTime } from "@/features/core";
import { statusFa } from "../../const";

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

type Props = {
  row: VisitRow;
  isGregorian: boolean;
};

export const VisitPrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ row, isGregorian }, ref) => {
    return (
      <div ref={ref} className="print-template">
        <style>{`
          .print-template {
            display: block;  /* قبلاً none بود */
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            direction: rtl;
            padding: 32px;
            color: #000;
          }
          @media print {
            body > * { display: none !important; }
            .print-template { display: block !important; }
          }
          .print-template h2 {
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
          .print-table th, .print-table td {
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
        `}</style>

        <h2>برگه ویزیت بیمار</h2>

        {/* اطلاعات بیمار */}
        <div className="print-section">
          <h3>اطلاعات بیمار</h3>
          <div className="print-grid">
            <div className="print-field">
              <span className="print-label">نام و نام خانوادگی:</span>
              <span>
                {row.firstName} {row.lastName}
              </span>
            </div>
            <div className="print-field">
              <span className="print-label">کد ملی:</span>
              <span>{row.codeMeli}</span>
            </div>
          </div>
        </div>

        {/* اطلاعات پزشک و وضعیت */}
        <div className="print-section">
          <h3>اطلاعات ویزیت</h3>
          <div className="print-grid">
            <div className="print-field">
              <span className="print-label">پزشک:</span>
              <span>
                {row.doctorFirstName} {row.doctorLastName}
              </span>
            </div>
            <div className="print-field">
              <span className="print-label">وضعیت:</span>
              <span>{statusFa[row.status] ?? row.status}</span>
            </div>
            <div className="print-field">
              <span className="print-label">زمان پذیرش:</span>
              <span>{formatDateWithTime(row.receptionTime, isGregorian)}</span>
            </div>
            <div className="print-field">
              <span className="print-label">زمان ویزیت:</span>
              <span>{formatDateWithTime(row.treatTime, isGregorian)}</span>
            </div>
            <div className="print-field">
              <span className="print-label">زمان دریافت دارو:</span>
              <span>
                {formatDateWithTime(row.reciveMedicineTime, isGregorian)}
              </span>
            </div>
            <div className="print-field">
              <span className="print-label">زمان خروج از اتاق:</span>
              <span>{formatDateWithTime(row.exitRoomAt, isGregorian)}</span>
            </div>
          </div>
          {row.extraNotes && (
            <div className="print-field" style={{ marginTop: 8 }}>
              <span className="print-label">یادداشت:</span>
              <span>{row.extraNotes}</span>
            </div>
          )}
        </div>

        {/* داروها */}
        <div className="print-section">
          <h3>داروهای تجویز شده</h3>
          {row.medicines?.length ? (
            <table className="print-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام دارو</th>
                  <th>تعداد</th>
                  <th>محل شارژ</th>
                </tr>
              </thead>
              <tbody>
                {row.medicines.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>{m.name}</td>
                    <td>{m.count ?? "-"}</td>
                    <td>{m.chargeLocation ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: 13, color: "#666" }}>دارویی ثبت نشده است.</p>
          )}
        </div>

        {/* آزمایش‌ها */}
        {row.tests?.length ? (
          <div className="print-section">
            <h3>آزمایش‌ها</h3>
            <table className="print-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>نام آزمایش</th>
                </tr>
              </thead>
              <tbody>
                {row.tests.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>{t.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="print-footer">
          <span>شماره ویزیت: {row.id}</span>
          <span>تاریخ چاپ: {formatDateWithTime(new Date(), isGregorian)}</span>
        </div>
      </div>
    );
  },
);

VisitPrintTemplate.displayName = "VisitPrintTemplate";
