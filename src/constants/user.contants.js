import { website, support, logo_nobg_96 } from "./assets.constants.js";

const baseEmailTemplate = ({
  title,
  heading,
  firstName,
  lastName = "",
  bodyContent,
  cta, // { href, label, bgColor }
  footerLinks = [
    { href: website, label: "Visit Our Website" },
    { href: support, label: "Contact Support" },
  ],
}) => {
  lastName = lastName ? ` ${lastName}` : ``;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="font-family: Arial, sans-serif; font-size: 14px; background-color: #ffffff; margin: 0;">
    <div style="max-width: 600px; background: #ffffff; padding: 20px 40px; margin: auto; text-align: left; margin-top: 20px;">
      <div style="text-align: center;">
        <img src="${logo_nobg_96}" alt="Hexagon Logo" style="width: 100px;">
      </div>
      <h2 style="color: #333;">${heading}</h2>
      <p>Dear <strong>${firstName}${lastName}</strong>,</p>
      ${bodyContent}
      ${
        cta
          ? `
        <a href="${cta.href}" style="display: inline-block; background-color: ${cta.bgColor}; color: #ffffff; padding: 10px 16px; text-decoration: none; font-weight: bold; border-radius: 5px;">${cta.label}</a>
      `
          : ""
      }
      <p>Best Regards, <br> <strong>The Hexagon Team</strong></p>

      <div style="text-align: center; padding-top: 40px; font-size: 12px; color: #777;">
        &copy; 2025 Hexagon. All rights reserved. <br>
        ${footerLinks
          .map(
            (link) =>
              `<a href="${link.href}" style="color: #777;">${link.label}</a>`
          )
          .join(" | ")}
      </div>
    </div>
  </body>
  </html>
  `;
};

// Email: Verify Email
const emailVerificationSubject = `Verify Email to Activate Your Hexagon Account!`;
const emailVerificationBody = (firstName, lastName, emailVerificationLink) =>
  baseEmailTemplate({
    title: "Verify Your Email",
    heading: "Verify Your Email",
    firstName,
    lastName,
    bodyContent: `<p>Thank you for signing up with Hexagon! Please verify your email to activate your account.</p>
                  <p>If you didn't request this, please ignore this email.</p>`,
    cta: {
      href: emailVerificationLink,
      label: "Verify My Email",
      bgColor: "#007bff",
    },
  });

// Email: Welcome
const welcomeEmailSubject = `Welcome to Hexagon! Account is Successfully Created!`;
const welcomeEmailBody = (firstName, lastName) =>
  baseEmailTemplate({
    title: "Welcome to Hexagon!",
    heading: "Welcome to Hexagon!",
    firstName,
    lastName,
    bodyContent: `<p>Your email has been successfully verified, and your account is now activated.</p>
                  <p>We’re excited to have you onboard!</p>`,
    cta: { href: website, label: "Go to Dashboard", bgColor: "#007bff" },
  });

// Email: Account Deletion
const accountDeletionEmailSubject = `Hexagon Account Deleted - We'll Miss You!`;
const accountDeletionEmailBody = (firstName, lastName, email) =>
  baseEmailTemplate({
    title: "Account Deletion Confirmation",
    heading: "Account Deletion Confirmation",
    firstName,
    lastName,
    bodyContent: `<p>Your account associated with <strong>${email}</strong> has been successfully deleted.</p>
                  <p>We're sorry to see you go. If you ever decide to return, we’d love to welcome you back!</p>`,
    cta: { href: support, label: "Contact Support", bgColor: "#ff3b30" },
  });

// Email: Password Reset OTP
const passwordResetOtpEmailSubject = `Hexagon | OTP to Reset Your Password`;
const passwordResetOtpEmailBody = (firstName, lastName, otpCode) =>
  baseEmailTemplate({
    title: "Password Reset OTP",
    heading: "Password Reset Request",
    firstName,
    lastName,
    bodyContent: `<p>We received a request to reset your password. Please use the OTP below to proceed:</p>
                  <div style="text-align: center; font-size: 20px; font-weight: bold; background-color: #f5f5f5; padding: 10px 0; border-radius: 5px; letter-spacing: 3px; margin: 20px 0;">${otpCode}</div>
                  <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
                  <p>If you did not request a password reset, please ignore this email.</p>`,
  });

export {
  welcomeEmailSubject,
  welcomeEmailBody,
  emailVerificationSubject,
  emailVerificationBody,
  accountDeletionEmailSubject,
  accountDeletionEmailBody,
  passwordResetOtpEmailSubject,
  passwordResetOtpEmailBody,
};
