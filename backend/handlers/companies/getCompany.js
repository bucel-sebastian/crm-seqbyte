const { db } = require("../../utils/database");

const getCompanyHandler = async (req, res) => {
  const { id } = req.query;

  const dbResponse = await db.select("crm_companies", [
    { column: "id", operator: "=", value: id, next: null },
  ]);

  if (dbResponse.length === 1) {
    return res.status(200).json({
      status: "success",
      data: dbResponse[0],
    });
  }
  return res.status(404).json({
    error: "Invalid ID",
  });
};

module.exports = { getCompanyHandler };
