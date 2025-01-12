const { db } = require("../../utils/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginHandler = async (req, res) => {
  const { email, password, remember_me } = req.body;

  if (!username || !passord) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const dbResponse = await db.select("crm_users", [
    { column: "email", operator: "=", value: email, next: null },
  ]);

  if (dbResponse.length === 1) {
    const user = await dbResponse[0];

    if (!user.is_active) {
      return res.status(401).json({ error: "User is not activated" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: remember_me ? "7d" : "12h" }
    );

    return res.json({ token });
  }

  return res.status(401).json({ error: "User doesn't exist" });
};

module.exports = { loginHandler };
