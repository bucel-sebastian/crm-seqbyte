const { db } = require("../../utils/database");
const bcrypt = require("bcrypt");
const { logger } = require("../../utils/logger");

const resetPasswordHandler = async (req, res) => {
  const { token, password, re_password } = req.body;

  if (!token || !password || !re_password) {
    return res
      .status(200)
      .json({ status: "fail", error: "Token and passwords are required" });
  }

  const dbResponse = await db.select("crm_password_recovery_tokens", [
    { column: "token", operator: "=", value: token, next: null },
  ]);

  if (dbResponse.length === 1) {
    const tokenData = dbResponse[0];
    if (password !== re_password) {
      return res
        .status(200)
        .json({ status: "fail", error: "Passwords doesn't match" });
    }

    const hashedPassword = await bcrypt.hash(password, 14);

    const updateResponse = await db.update(
      "crm_users",
      { password: hashedPassword },
      [{ column: "id", operator: "=", value: tokenData.user_id, next: null }]
    );

    if (updateResponse.length === 1) {
      await logger.insert("success", tokenData.user_id, "Password reset");
      return res.json({ status: "success" });
    }
    return res.status(200).json({
      status: "fail",
      error: "There was a problem when we tried to encrypt your password",
    });
  }
  return res.status(200).json({ status: "fail", error: "Token is invalid" });
};

module.exports = { resetPasswordHandler };
