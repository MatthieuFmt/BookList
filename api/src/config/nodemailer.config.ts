const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your_email@example.com",
    pass: "your_email_password",
  },
});

module.exports = transport;
