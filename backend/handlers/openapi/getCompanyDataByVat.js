const getCompanyDataByVatHandler = async (req, res) => {
  const { vat } = req.query;

  if (!vat) {
    return res.status(200).json({ status: "fail", error: "VAT is required." });
  }

  const response = await fetch(`${process.env.OPENAPI_URL}/api/companies/${vat}`, {
    headers: {
      "x-api-key": process.env.OPENAPI_KEY,
    },
  });

  if (response.ok) {
    const body = await response.json();

    return res.status(200).json({ status: "success", data: body });
  } else {
    const body = await response.json();
    if (body?.error) {
      return res
        .status(200)
        .json({ status: "fail", error: "VAT code is invalid." });
    }
  }
  return res
    .status(200)
    .json({ status: "fail", error: "There was a problem with OpenAPI." });
};

module.exports = { getCompanyDataByVatHandler };
