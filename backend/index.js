require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const upload = multer();

const apiRoutesV1 = require("./routes/v1/apiRoutes");
const { checkNonce } = require("./handlers/nonce");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost";

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.any());

app.use((req, res, next) => {
  console.log(`${req.method} on route ${req.url}`);
  next();
});

app.use(checkNonce);

app.use("/api/v1", apiRoutesV1);

app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
