const { db } = require("../../utils/database");
const { logger } = require("../../utils/logger");

const editCompanyHandler = async (req, res) => {
  const {
    user_id,
    id,
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

  let dbUpdateResponse = [];
  try {
    dbUpdateResponse = await db.update(
      "crm_companies",
      {
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
      },
      [{ column: "id", operator: "=", value: id, next: null }]
    );
    console.log(dbUpdateResponse);
  } catch (error) {
    await logger.insert(
      "error",
      user_id,
      `Error when tried to update a company - ${error}`,
      JSON.stringify({
        id: id,
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

  if (dbUpdateResponse.length !== 1) {
    return res.status(200).json({
      status: "fail",
      error: "There was a problem when we tried to update company",
    });
  }

  await logger.insert(
    "success",
    user_id,
    `Company updated - ${dbUpdateResponse[0].id}`
  );

  return res.status(200).json({ status: "success" });
};

module.exports = { editCompanyHandler };
