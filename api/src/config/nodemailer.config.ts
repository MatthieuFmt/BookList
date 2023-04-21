import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.ADRESS_MAIL,
    pass: process.env.PASSWORD_MAIL,
  },
});
