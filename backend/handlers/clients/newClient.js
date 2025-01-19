const { db } = require("../../utils/database");
const { logger } = require("../../utils/logger");

const newClientHandler = async (req, res) => {
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
  });

  const vatFull = `${tva_payer === "yes" ? "RO" : ""}${vat}`;

  const dbSearchResponse = await db.select("crm_clients", [
    { column: "vat", operator: "=", value: vatFull, next: null },
  ]);
  if (dbSearchResponse === 1) {
    return res
      .status(200)
      .json({ status: "fail", error: "Client already exists" });
  }

  let dbInsertResponse = [];
  try {
    dbInsertResponse = await db.insert("crm_clients", {
      name: name,
      vat: vatFull,
      no_reg_com: no_reg_com,
      country: country,
      county: county,
      city: city,
      address: address,
      bank_name: bank_name,
      bank_iban: bank_iban,
    });
  } catch (error) {
    await logger.insert(
      "error",
      user_id,
      `Error when tried to insert new client - ${error}`,
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
      })
    );
  }

  if (dbInsertResponse.length !== 1) {
    return res.status(200).json({
      status: "fail",
      error: "There was a problem when we tried to insert client",
    });
  }

  await logger.insert(
    "success",
    user_id,
    `Added new client - ${dbInsertResponse[0].id}`
  );

  return res
    .status(200)
    .json({ status: "success", id: dbInsertResponse[0].id });
};

module.exports = { newClientHandler };
