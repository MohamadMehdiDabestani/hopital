type Unsubscribe = () => void;

export function subscribeToVisits({
  method,
  siteId,
  onMessage,
}: {
  method: "sse" | "socket";
  siteId: string;
  onMessage: (payload: any) => void;
}): Unsubscribe {
  if (method === "sse") {
    const es = new EventSource(`/api/visits/stream?siteId=${siteId}`);

    const handler = (event: MessageEvent) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (err) {
        console.error("[client:sse] parse error", err);
      }
    };

    es.addEventListener("visits:changed", handler);

    return () => {
      es.removeEventListener("visits:changed", handler);
      es.close();
    };
  }

  if (method === "socket") {
    const { io } = require("socket.io-client");

    const socket = io("/", {
      path: "/socket.io",
      withCredentials: true,
      query: { siteId },
    });

    socket.on("visits:changed", onMessage);

    return () => {
      socket.off("visits:changed", onMessage);
      socket.disconnect();
    };
  }

  throw new Error(`Unsupported method: ${method}`);
}
