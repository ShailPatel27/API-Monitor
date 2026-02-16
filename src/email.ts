import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

export async function sendMail(to: string, html: string) {
  await transporter.sendMail({
    from: `"API Monitor" <${process.env.USER_EMAIL}>`,
    to,
    subject: "Unable to Fetch API!",
    html,
  });

  console.log("Mail Sent!");
}
