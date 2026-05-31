import { getUser } from "@/features/auth/utils/dal";
import {
  startVisitsListener,
  onVisitsChange,
} from "@/features/core/utils/pgListener";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await startVisitsListener();

  const encoder = new TextEncoder();
  const user = await getUser();
  if (!user) return NextResponse.redirect("/");
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
        console.log(payload);
        const data = JSON.parse(payload);
        if (data.siteId === user.siteId) {
          send(payload);
        }
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
