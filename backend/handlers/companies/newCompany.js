const { db } = require("../../utils/database");
const { logger } = require("../../utils/logger");

const newCompanyHandler = async (req, res) => {
  const {
    user_id,
    name,
    vat,
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

  console.log({
    user_id,
    name,
    vat,
    no_reg_com,
    country,
    county,
    city,
    address,
    bank_name,
    bank_iban,
    establishment_date,
    owner,
  });

  const dbSearchResponse = await db.select("crm_companies", [
    { column: "vat", operator: "=", value: vat, next: null },
  ]);

  if (dbSearchResponse === 1) {
    return res
      .status(200)
      .json({ status: "fail", error: "Company already exists" });
  }

  let dbInsertResponse = [];
  try {
    dbInsertResponse = await db.insert("crm_companies", {
      name: name,
      vat: vat,
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
        vat: vat,
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
