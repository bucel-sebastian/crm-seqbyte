const { db } = require("../../utils/database");

const getCompaniesHandler = async (req, res) => {
  const dbResponse = await db.select("crm_companies");

  return res.status(200).json(dbResponse);
};

module.exports = { getCompaniesHandler };
