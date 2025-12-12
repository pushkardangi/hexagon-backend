import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, email_body) => {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email credentials (EMAIL_USER, EMAIL_PASSWORD) are not configured in environment variables");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add connection timeout settings
      connectionTimeout: 5000,
      socketTimeout: 5000,
    });

    const mailOptions = {
      from: `"Hexagon" ${process.env.EMAIL_USER}`,
      to,
      subject,
      html: email_body,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
