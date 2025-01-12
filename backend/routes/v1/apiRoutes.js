const express = require("express");

const { loginHandler } = require("../../handlers/auth/login");

const router = express.Router();

// Auth Routes
router.post("/login", loginHandler);

router.get("/test", (req, res) => {
  return res.json({
    status: "success",
  });
});

// Dashboard Routes

module.exports = router;
