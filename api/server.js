const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const userRoutes = require("./src/routes/studentRoutes");
const lecturerRoutes = require("./src/routes/lecturerRoutes");
const generalRoutes = require("./src/routes/generalRoutes");
const evaluationRoutes = require("./src/routes/evaluationsRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Enable credentials (including cookies)
  })
);
app.use(cookieParser());
// endpoint
app.use("/", userRoutes);
app.use("/", lecturerRoutes);
app.use("/", generalRoutes);
app.use("/", evaluationRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
