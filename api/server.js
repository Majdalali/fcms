const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/studentRoutes");
const lecturerRoutes = require("./src/routes/lecturerRoutes");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

// endpoint
app.use("/", userRoutes);
app.use("/", lecturerRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
