const { db } = require("../../utils/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../../utils/logger");

const loginHandler = async (req, res) => {
  const { email, password, remember_me } = req.body;

  if (!email || !password) {
    return res
      .status(200)
      .json({ status: "fail", error: "Email and password are required" });
  }

  const dbResponse = await db.select("crm_users", [
    { column: "email", operator: "=", value: email, next: null },
  ]);

  if (dbResponse.length === 1) {
    const user = await dbResponse[0];

    if (!user.is_active) {
      return res
        .status(200)
        .json({ status: "fail", error: "User is not activated" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(200).json({ status: "fail", error: "Wrong password" });
    }

    const token = await jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_primary_account: user.is_primary_account,
      },
      process.env.JWT_SECRET,
      { expiresIn: remember_me ? "7d" : "12h" }
    );
    await logger.insert("info", user.id, "Logged in");

    return res.json({ status: "success", token });
  }

  return res.status(200).json({ status: "fail", error: "User doesn't exist" });
};

module.exports = { loginHandler };
