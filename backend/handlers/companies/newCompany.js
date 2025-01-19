const { db } = require("../../utils/database");
const { logger } = require("../../utils/logger");

const newCompanyHandler = async (req, res) => {
  const {
    user_id,
    name,
    vat,
    tva_payer,
    no_reg_com,
    country,
    county,
    city,
    address,
    bank_name,
    bank_iban,
    establishment_date,
    owner,
  } = req.body;

  const vatFull = `${tva_payer === "yes" ? "RO" : ""}${vat}`;

  const dbSearchResponse = await db.select("crm_companies", [
    { column: "vat", operator: "=", value: vatFull, next: null },
  ]);

  if (dbSearchResponse.length > 0) {
    return res
      .status(200)
      .json({ status: "fail", error: "Company already exists" });
  }

  let dbInsertResponse = [];
  try {
    dbInsertResponse = await db.insert("crm_companies", {
      name: name,
      vat: vatFull,
      no_reg_com: no_reg_com,
      country: country,
      county: county,
      city: city,
      address: address,
      bank_name: bank_name,
      bank_iban: bank_iban,
      establishment_date: establishment_date,
      owner: owner,
    });
  } catch (error) {
    await logger.insert(
      "error",
      user_id,
      `Error when tried to insert new company - ${error}`,
      JSON.stringify({
        name: name,
        vat: vatFull,
        no_reg_com: no_reg_com,
        country: country,
        county: county,
        city: city,
        address: address,
        bank_name: bank_name,
        bank_iban: bank_iban,
        establishment_date: establishment_date,
        owner: owner,
      })
    );
  }

  if (dbInsertResponse.length !== 1) {
    return res.status(200).json({
      status: "fail",
      error: "There was a problem when we tried to insert company",
    });
  }

  await logger.insert(
    "success",
    user_id,
    `Added new company - ${dbInsertResponse[0].id}`
  );

  return res
    .status(200)
    .json({ status: "success", id: dbInsertResponse[0].id });
};

module.exports = { newCompanyHandler };
