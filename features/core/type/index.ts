export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };
export type DateTimeTrigger = "shamsi" | "miladi"