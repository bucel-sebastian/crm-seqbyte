const express = require("express");

const { loginHandler } = require("../../handlers/auth/login");
const { generateNonce } = require("../../handlers/nonce");
const {
  forgotPasswordHandler,
} = require("../../handlers/auth/forgot-password");
const { resetPasswordHandler } = require("../../handlers/auth/reset-password");

const router = express.Router();

// Nonce Route
router.get("/security/nonce", async (req, res) => {
  const nonce = await generateNonce();
  return res.json({
    nonce,
  });
});

// Auth Routes
router.post("/auth/login", loginHandler);
router.post("/auth/forgot-password", forgotPasswordHandler);
router.post("/auth/forgot-password/reset", resetPasswordHandler);

router.get("/test", (req, res) => {
  return res.json({
    status: "success",
  });
});

// Dashboard Routes

module.exports = router;
