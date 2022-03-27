import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("A user has connected")

  socket.on("disconnect", () => {
    console.log("User has disconnected")
  })
});

const port = process.env.PORT || 4321;
server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})