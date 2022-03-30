import { Server } from "socket.io";

export function setupHandlers(io: Server) {
  io.on("connection", () => {
    console.log("WOOHOO");
  });
}