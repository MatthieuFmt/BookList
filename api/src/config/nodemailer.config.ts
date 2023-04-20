import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.ADRESS_EMAIL,
    pass: process.env.ADRESS_PASSWORD,
  },
});
