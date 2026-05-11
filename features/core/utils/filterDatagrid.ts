import { and, or, ilike, eq, asc, desc, SQL } from "drizzle-orm";

type SortItem = { field: string; sort: "asc" | "desc" };
type FilterItem = {
  field: string;
  operator: "contains" | "equals";
  value: any;
};

export function parseGridParams(reqUrl: string) {
  const { searchParams } = new URL(reqUrl);

  const page = Number(searchParams.get("page") ?? "0");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const sort = searchParams.get("sort");
  const filter = searchParams.get("filter");

  const sortModel: SortItem[] = sort ? JSON.parse(sort) : [];
  const filterModel = filter
    ? JSON.parse(filter)
    : { items: [], quickFilterValues: [] };

  return { page, pageSize, sortModel, filterModel };
}

export function buildWhere(
  columnMap: Record<string, any>,
  filterModel: { items?: FilterItem[]; quickFilterValues?: any[] },
  quickSearchCols: any[] = [],
) {
  const conditions: SQL[] = [];

  // quick filter
  const quick = (filterModel.quickFilterValues ?? [])
    .map((v) => String(v).trim())
    .filter(Boolean);

  for (const q of quick) {
    if (!quickSearchCols.length) continue;
    const like = `%${q}%`;
    const expr = or(...quickSearchCols.map((c) => ilike(c, like)));
    if (expr) conditions.push(expr);
  }

  // column filters
  for (const it of filterModel.items ?? []) {
    if (!it.field || !it.operator || it.value == null || it.value === "")
      continue;
    const col = columnMap[it.field];
    if (!col) continue;

    if (it.operator === "contains")
      conditions.push(ilike(col, `%${it.value}%`));
    if (it.operator === "equals") conditions.push(eq(col, it.value));
  }

  return conditions.length ? and(...conditions) : undefined;
}

export function buildOrderBy(
  columnMap: Record<string, any>,
  sortModel: SortItem[],
  fallback: any,
) {
  if (!sortModel[0]) return fallback;
  const { field, sort } = sortModel[0];
  const col = columnMap[field];
  if (!col) return fallback;
  return sort === "asc" ? asc(col) : desc(col);
}
