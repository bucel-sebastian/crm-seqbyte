require("dotenv").config();

const express = require("express");
const cors = require("cors");

const apiRoutesV1 = require("./routes/v1/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost";

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${req.method} on route ${req.url}`);
  next();
});

app.use("/api/v1", apiRoutesV1);

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
