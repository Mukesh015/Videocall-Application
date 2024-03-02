const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({ path: "../.env.local" });
process.setMaxListeners(3);
const app = express();
const ioPort = process.env.IO_PORT;
const PORT = process.env.PORT;
const io = new Server({
  cors: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

app.get("/api/generatesessionid", (req, res) => {
  const length = 9;
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomChar = alphabet.charAt(
      Math.floor(Math.random() * alphabet.length)
    );
    randomString += randomChar;
    if ((i + 1) % 3 === 0 && i !== length - 1) {
      randomString += "-";
    }
  }
  res.status(200).send({ token: randomString });
});
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
io.on("connection", (socket) => {
  socket.on("join-room", ({ email, roomId }) => {
    emailToSocketIdMap.set(email, socket.id);
    socketIdToEmailMap.set(socket.id, email);
    io.to(roomId).emit("user-joined", { email, id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("join-room", { email, roomId });
    console.log("user joined", email, roomId);
  });

  socket.on("call-user", ({ to, offer }) => {
    setTimeout(() => {
      io.to(to).emit("incomming-call", { from: socket.id, offer });
    }, 1000);
  });
  socket.on("call-accepted", ({ to, ans }) => {
    io.to(to).emit("call-accepted", { from: socket.id, ans });
  });
  socket.on("peer-nego-needed", ({ to, offer }) => {
    console.log("peer-nego-needed");
    io.to(to).emit("peer-nego-needed", { from: socket.id, offer });
  });

  socket.on("peer-nego-done", ({ to, ans }) => {
    console.log("peer:nego:done");
    io.to(to).emit("nego-final", { from: socket.id, ans });
  });
});
app.listen(PORT, () => {
  console.log(`Server listening from http://localhost:${PORT}`);
});
io.listen(ioPort, () => {
  console.log(`Socket listening on http://localhost:${ioPort}`);
});
