import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, email_body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Hexagon" ${process.env.EMAIL_USER}`,
      to,
      subject,
      html: email_body,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
