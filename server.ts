const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const {
  startVisitsListener,
  onVisitsChange,
  stopVisitsListener,
} = require("./features/core/utils/pgListener");
const {getSocketUser} = require("./features/auth/utils/socketAuth")
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.NODE_ENV == "development" ? "localhost" : "0.0.0.0";
const port = process.env.PORT || 3000;

const method = (process.env.NEXT_PUBLIC_SUBSCRIBE_METHOD || "sse").toLowerCase();
const enableSocket = method === "socket" || method === "socketio";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const siteRoom = (siteId : number) => `site:${siteId}`;

app.prepare().then(async () => {
  let io : any = null;
  let unsubscribe = null;

  const server = createServer(async (req : any, res : any) => {
    try {
      const parsedUrl = parse(req.url || "/", true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  server.once("error", (err : any) => {
    console.error("Fatal HTTP server error:", err);
    process.exit(1);
  });

  await startVisitsListener();

  if (enableSocket) {
    io = new Server(server, {
      path: "/socket.io",
      cors: { origin: true, credentials: true },
    });
    io.use(async (socket : any, next : any) => {
      const cookie = socket.handshake.headers.cookie;
      const user = await getSocketUser(cookie);

      if (user && user.siteId) {
        socket.user = user;
        next();
      } else {
        next(new Error("Unauthorized: Invalid session or no site assigned"));
      }
    });
    unsubscribe = onVisitsChange((payloadStr : any) => {
      try {
        const payload =
          typeof payloadStr === "string" ? JSON.parse(payloadStr) : payloadStr;

        const siteId = payload?.siteId;
        if (!siteId) {
          console.warn("visits:changed payload missing siteId:", payload);
          return;
        }

        io.to(siteRoom(siteId)).emit("visits:changed", payload);
      } catch (err) {
        console.error("Socket emit parse error:", err);
      }
    });

    io.on("connection", (socket : any) => {
      const siteId = socket.user.siteId;
      socket.join(siteRoom(siteId));

      console.log("Socket connected:", socket.id, "joined", siteRoom(siteId));

      socket.emit("visits:connected", { ok: true, siteId });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });
  }

  const shutdown = async (signal : any) => {
    console.log(`Received ${signal}, shutting down...`);
    try {
      unsubscribe?.();
      io?.close();

      await stopVisitsListener();

      server.close(() => process.exit(0));
    } catch (e) {
      console.error("Shutdown error:", e);
      process.exit(1);
    }
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port} (method=${method})`);
  });
});
