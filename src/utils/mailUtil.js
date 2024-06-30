import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

// >>>>>>>>>> Send Email
export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
