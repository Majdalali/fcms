const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

// endpoint
app.use("/", userRoutes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
