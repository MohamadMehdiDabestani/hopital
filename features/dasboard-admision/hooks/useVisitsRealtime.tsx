"use client";

import { useEffect, useMemo, useRef } from "react";

type SubscribeMethod = "sse" | "socket" | "socketio";
type VisitsChangedPayload = any;

type Options = {
  enabled?: boolean;
  onChange: (payload: VisitsChangedPayload) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  ssePath?: string;
  siteId?: string; // فقط اگر موقتاً از query می‌گیری
};

function getMethodFromEnv(): SubscribeMethod {
  const raw = (process.env.NEXT_PUBLIC_SUBSCRIBE_METHOD || "sse").toLowerCase();
  if (raw === "socketio") return "socketio";
  if (raw === "socket") return "socket";
  return "sse";
}

export function useVisitsRealtime({
  enabled = true,
  onChange,
  onConnected,
  onDisconnected,
  siteId,
}: Options) {
  const method = useMemo(() => getMethodFromEnv(), []);
  const cleanupRef = useRef<null | (() => void)>(null);
  const onChangeRef = useRef(onChange);
  const onConnectedRef = useRef(onConnected);
  const onDisconnectedRef = useRef(onDisconnected);
  useEffect(() => {
    if (!enabled) return;
    cleanupRef.current?.();
    cleanupRef.current = null;

    if (method === "sse") {
      const es = new EventSource("/api/dashboard/admision/streamQueue");

      const handleOpen = () => onConnected?.();
      const handleError = () => onDisconnected?.();

      es.addEventListener("open", handleOpen);
      es.addEventListener("error", handleError);
      // es.addEventListener("visits:changed", handleChanged as any);
      es.onmessage = (ev) => onChange(JSON.parse(ev.data));
      cleanupRef.current = () => {
        es.removeEventListener("open", handleOpen);
        es.removeEventListener("error", handleError);
        es.close();
      };

      return () => cleanupRef.current?.();
    }

    // Socket.io
    let socket: any;
    let cancelled = false;

    (async () => {
      const { io } = await import("socket.io-client");
      if (cancelled) return;

      socket = io("/", {
        path: "/socket.io",
        withCredentials: true,
        autoConnect: true,
        transports: ["websocket", "polling"],
        ...(siteId ? { query: { siteId } } : {}),
      });

      const handleConnect = () => onConnectedRef.current?.();
      const handleDisconnect = () => onDisconnectedRef.current?.();
      const handleChanged = (payload: VisitsChangedPayload) =>
        onChangeRef.current(payload);

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("visits:changed", handleChanged);

      cleanupRef.current = () => {
        try {
          socket.off("connect", handleConnect);
          socket.off("disconnect", handleDisconnect);
          socket.off("visits:changed", handleChanged);
          socket.disconnect();
        } catch {}
      };
    })().catch((e) => {
      console.error("[useVisitsRealtime:socket] init error:", e);
    });

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [enabled, method, siteId]);

  return { method };
}
