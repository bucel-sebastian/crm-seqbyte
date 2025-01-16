const { db } = require("../../utils/database");
const { mailer } = require("../../utils/mailer");
const { logger } = require("../../utils/logger");

const generateToken = async (id, email) => {
  const encoder = new TextEncoder();
  const timestamp = Date.now();
  const data = `${id}-${email}-${timestamp}`;

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(data)
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

const tokenExists = async (token) => {
  const dbResponse = await db.select("crm_password_recovery_tokens", [
    { column: "token", operator: "=", value: token, next: null },
  ]);

  return dbResponse.length > 0;
};

const deleteExistingToken = async (userId) => {
  await db.delete("crm_password_recovery_tokens", [
    { column: "user_id", operator: "=", value: userId },
  ]);
};

const forgotPasswordHandler = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(200).json({ status: "fail", error: "Email is required" });
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

    await deleteExistingToken(user.id);

    let token;
    let retries = 0;
    do {
      token = await generateToken(user.id, user.email);
      retries++;
      if (retries > 5) {
        token = null;
      }
    } while (await tokenExists(token));

    if (token === null) {
      return res.status(200).json({
        status: "fail",
        error:
          "There was a problem while we tried to generate the recover token",
      });
    }

    await db.insert("crm_password_recovery_tokens", {
      user_id: user.id,
      token: token,
    });
    await logger.insert("info", user.id, "Request password recovery token");

    const subject = "Resetare parola";
    const messageText = `Salut ${user?.first_name} ${user?.last_name}\n\n
  <a href="${process.env.FRONTEND_URL}/forgot-password/reset?token=${token}&email=${user.email}">Reseteaza parola</a>`;
    const messageHtml = `
  <p>Salut ${user?.first_name} ${user?.last_name}</p>
  <br/>
  <a href="${process.env.FRONTEND_URL}/forgot-password/reset?token=${token}&email=${user.email}">Reseteaza parola</a>
  `;
    const mailResponse = await mailer.sendEmail(
      user.email,
      subject,
      messageText,
      messageHtml
    );

    console.log(mailResponse.response);
    if (mailResponse.response.startsWith("250")) {
      return res.status(200).json({
        status: "success",
      });
    }
    return res.status(200).json({
      status: "fail",
      error: "There was a problem while we tried to send the recover token",
    });
  }
  return res.status(200).json({ status: "fail", error: "User doesn't exist" });
};

module.exports = { forgotPasswordHandler };
