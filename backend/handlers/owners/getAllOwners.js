const { db } = require("../../utils/database");

const getAllOwnersHandler = async (req, res) => {
  const dbResponse = await db.select("crm_users", [
    {
      column: "role",
      operator: "=",
      value: "admin",
      next: "OR",
    },
    {
      column: "role",
      operator: "=",
      value: "owner",
      next: null,
    },
  ]);

  console.log("response", dbResponse);

  const data = dbResponse.map((row) => ({
    name: `${row.first_name} ${row.last_name}`,
    id: row.id,
  }));

  return res.status(200).json({
    data,
  });
};

module.exports = { getAllOwnersHandler };
