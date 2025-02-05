// cli/socketServer.ts

import http from "http";
import { Server } from "socket.io";

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow connections from any origin; adjust as needed
    methods: ["GET", "POST"],
  },
});

// Log when clients connect or disconnect.
io.on("connection", (socket) => {
  console.log(`A client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`A client disconnected: ${socket.id}`);
  });
});

// Listen on port 3000 (or any port you prefer)
httpServer.listen(3000, () => {
  // console.log("Socket.IO server listening on port 3000");
});

export function broadcastMessage(message: string) {
  io.emit("cliMessage", message);
}
