import postgres from "postgres";

type Listener = (payload: string) => void;

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
  idle_timeout: 0,
  connect_timeout: 10,
});

let started = false;
const listeners = new Set<Listener>();

export function onVisitsChange(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export async function startVisitsListener() {
  if (started) return;
  started = true;

  await sql.listen("visits_changes", (payload) => {
    for (const cb of listeners) cb(payload);
  });
}