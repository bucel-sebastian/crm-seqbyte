const { db } = require("../../utils/database");

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCompaniesHandler = async (req, res) => {
  const { page, rowsPerPage } = req.query;

  const dbResponse = await db.selectPaginate(
    "crm_companies",
    page,
    rowsPerPage
  );

  const dbOwnersResponse = await db.select("crm_users", [
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

  dbResponse.forEach((row) => {
    const owner = dbOwnersResponse.find((owner) => owner.id === row.owner);

    row.owner = {
      name: `${owner.first_name} ${owner.last_name}`,
      id: owner.id,
    };
  });

  const dbCountResponse = await db.query("SELECT COUNT(*) FROM crm_companies");

  return res.status(200).json({
    data: dbResponse,
    count: dbCountResponse[0].count,
  });
};

module.exports = { getCompaniesHandler };
