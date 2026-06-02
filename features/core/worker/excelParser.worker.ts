import * as XLSX from "xlsx";
import { ExcelParserOptions } from "../type";

type WorkerMessage = {
  buffer: ArrayBuffer;
  headerMap: ExcelParserOptions<unknown>["headerMap"];
};

type WorkerResult =
  | { success: true; rows: { id: string; rawData: Record<string, unknown> }[] }
  | { success: false; error: string };

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { buffer, headerMap } = e.data;

  try {
    const workbook = XLSX.read(buffer, {
      type: "array",
      cellText: false,
      cellDates: true,
      raw: false,
    });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!worksheet) {
      throw new Error("فایل اکسل خالی است یا فرمت صحیحی ندارد");
    }

    const jsonData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    if (jsonData.length < 2) {
      throw new Error("فایل اکسل خالی است یا فرمت صحیحی ندارد");
    }

    const headerRow = jsonData[0] as string[];
    const mappedHeaders = headerRow.map((h) => headerMap[h?.trim()] ?? h);

    const dataRows = jsonData
      .slice(1)
      .filter((row) => row.some((cell) => cell !== "" && cell !== null && cell !== undefined));

    const rows = dataRows.map((row, index) => {
      const rawData: Record<string, unknown> = {};
      mappedHeaders.forEach((header, i) => {
        if (header) rawData[header] = row[i] ?? "";
      });
      return { id: `row-${index}`, rawData };
    });

    const result: WorkerResult = { success: true, rows };
    self.postMessage(result);
  } catch (err) {
    const result: WorkerResult = {
      success: false,
      error: err instanceof Error ? err.message : "خطا در خواندن فایل",
    };
    self.postMessage(result);
  }
};
