const { db } = require("../../utils/database");

const getClientsHandler = async (req, res) => {
  const { page, rowsPerPage } = req.query;

  const dbResponse = await db.selectPaginate("crm_clients", page, rowsPerPage);
  const dbCountResponse = await db.query("SELECT COUNT(*) FROM crm_clients");

  return res.status(200).json({
    data: dbResponse,
    count: dbCountResponse[0].count,
  });
};

module.exports = { getClientsHandler };
