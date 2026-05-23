import type { z } from "zod";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export type DateTimeTrigger = "shamsi" | "miladi";

export interface ParsedRow<T = Record<string, any>> {
  id: string;
  selected: boolean;
  data: T;
  validationError: string;
  isValid: boolean;
}

export interface ExcelParserOptions<T> {
  headerMap: Record<string, string>;
  schema: z.ZodSchema<T>;
  transformRow?: (rowData: Record<string, any>) => Record<string, any>;
}

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