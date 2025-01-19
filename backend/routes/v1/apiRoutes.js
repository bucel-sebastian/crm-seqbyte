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
const {
  deleteCompanyHandler,
} = require("../../handlers/companies/deleteCompany");
const { getAllOwnersHandler } = require("../../handlers/owners/getAllOwners");
const {
  getCompanyDataByVatHandler,
} = require("../../handlers/openapi/getCompanyDataByVat");
const {
  getExchangeRateHandler,
} = require("../../handlers/openapi/getExchangeRate");
const { getCompanyHandler } = require("../../handlers/companies/getCompany");
const { editCompanyHandler } = require("../../handlers/companies/editCompany");

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

// Companies
router.get("/companies/autocomplete", getCompanyDataByVatHandler);
router.get("/companies/list", getCompaniesHandler);
router.post("/companies/new", newCompanyHandler);
router.get("/companies/single", getCompanyHandler);
router.post("/companies/edit", editCompanyHandler);
router.post("/companies/delete", deleteCompanyHandler);

// Clients
router.get("/clients/list", getClientsHandler);
router.post("/clients/new", newClientHandler);

// Owners
router.get("/owners/all", getAllOwnersHandler);

// Invoices
router.get("/currency/rate", getExchangeRateHandler);

router.get("/test", (req, res) => {
  return res.json({
    status: "success",
  });
});

// Dashboard Routes

module.exports = router;
