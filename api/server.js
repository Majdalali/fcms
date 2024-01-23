const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

// Routes
// const lecturerRoutes = require("./src/routes/lecturerRoutes");
const generalRoutes = require("./src/routes/generalRoutes");
const evaluationRoutes = require("./src/routes/evaluationsRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const connectedUsers = {};
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("userId", (userId) => {
    // Store user's socket connection with their ID
    console.log("User Logged in with id: ", userId);
    connectedUsers[userId] = socket.id;
    // console.log("Connected Users in server.js:", connectedUsers);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    // Remove the user's socket connection when disconnected
    // You can add this logic based on your use case
  });
});

// Endpoint routes
const lecturerRoutes = require("./src/routes/lecturerRoutes")(
  io,
  connectedUsers
);

const studentRoutes = require("./src/routes/studentRoutes")(io, connectedUsers);

app.use("/", studentRoutes);
app.use("/", lecturerRoutes);
app.use("/", generalRoutes);
app.use("/", evaluationRoutes);
app.use("/", adminRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { connectedUsers };
