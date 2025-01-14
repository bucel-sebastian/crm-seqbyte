const express = require("express");

const { loginHandler } = require("../../handlers/auth/login");
const { generateNonce } = require("../../handlers/nonce");

const router = express.Router();

// Nonce Route
router.get("/security/nonce",async (req, res) => {
  const nonce = await generateNonce();
  return res.json({
    nonce,
  });
});

// Auth Routes
router.post("/login", loginHandler);

router.get("/test", (req, res) => {
  return res.json({
    status: "success",
  });
});

// Dashboard Routes

module.exports = router;
