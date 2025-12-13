import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, email_body) => {
  try {
    // Validate email recipient
    if (!to || typeof to !== "string" || !to.includes("@")) {
      throw new Error(`Invalid recipient email: ${to}`);
    }

    // Validate email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email credentials (EMAIL_USER, EMAIL_PASSWORD) are not configured in environment variables");
    }

    // Validate subject and body
    if (!subject || !email_body) {
      throw new Error("Email subject or body is missing");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 9000,
      socketTimeout: 9000,
    });

    const mailOptions = {
      from: `"Hexagon" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: email_body,
    };

    // Verify connection and send email
    await transporter.verify();
    const result = await transporter.sendMail(mailOptions);
    
    return result;
  } catch (error) {
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
};
