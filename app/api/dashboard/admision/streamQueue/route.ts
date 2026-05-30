import {
  startVisitsListener,
  onVisitsChange,
} from "@/features/core/utils/pgListener";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await startVisitsListener();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const safeEnqueue = (str: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(str));
        } catch {
          closed = true;
        }
      };

      const send = (data: string) => {
        safeEnqueue(`data: ${data}\n\n`);
      };

      send(JSON.stringify({ type: "connected" }));

      const unsubscribe = onVisitsChange((payload) => {
        send(typeof payload === "string" ? payload : JSON.stringify(payload));
      });

      const ping = setInterval(() => {
        safeEnqueue(`event: ping\ndata: {}\n\n`);
      }, 25000);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(ping);
        unsubscribe();
        try {
          controller.close();
        } catch {}
      };

      req.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
