const express = require("express");

const { loginHandler } = require("../../handlers/auth/login");
const { generateNonce } = require("../../handlers/nonce");
const {
  forgotPasswordHandler,
} = require("../../handlers/auth/forgot-password");
const { resetPasswordHandler } = require("../../handlers/auth/reset-password");

const {
  getCompaniesHandler,
} = require("../../handlers/companies/getCompanies");
const { newCompanyHandler } = require("../../handlers/companies/newCompany");
const { getClientsHandler } = require("../../handlers/clients/getClients");
const { newClientHandler } = require("../../handlers/clients/newClient");

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

// Data

// Campaigns
router.get("/companies/list", getCompaniesHandler);
router.post("/companies/new", newCompanyHandler);

// Clients
router.get("/clients/list", getClientsHandler);
router.post("clients/new", newClientHandler);

router.get("/test", (req, res) => {
  return res.json({
    status: "success",
  });
});

// Dashboard Routes

module.exports = router;
