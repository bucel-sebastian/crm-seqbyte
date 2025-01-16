const nodemailer = require("nodemailer");

class Mailer {
  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async sendEmail(
    to,
    subject,
    messageText,
    messageHtml,
    attachments,
    from = "no-reply@seqbyte.com",
    fromName = "Seqbyte ERP",
    headers = {}
  ) {
    const mailResponse = await this.transporter.sendMail({
      from: `"${fromName}" <${from}>`,
      to: to,
      subject: subject,
      text: messageText,
      html: messageHtml,
      headers: headers,
    });
    return {
      response: mailResponse.response,
      messageId: mailResponse.messageId,
    };
  }
}

const mailer = new Mailer();

module.exports = { mailer };
