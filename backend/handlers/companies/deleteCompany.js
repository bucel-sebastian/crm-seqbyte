const { db } = require("../../utils/database");
const { logger } = require("../../utils/logger");

const deleteCompanyHandler = async (req, res) => {
  const { id, user_id } = req.body;

  const dbResponse = await db.delete("crm_companies", [
    {
      column: "id",
      operator: "=",
      value: id,
      next: null,
    },
  ]);

  if (dbResponse.length === 1) {
    await logger.insert(
      "success",
      user_id,
      `Deleted company - ${dbResponse[0].id}`,
      JSON.stringify(dbResponse[0])
    );
    return res.status(200).json({ status: "success" });
  }
  return res.status(200).json({ status: "fail" });
};

module.exports = { deleteCompanyHandler };
