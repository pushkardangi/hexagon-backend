import { website, support, logo_nobg_96 } from "./app-assets.constants.js";

const emailVerificationSubject = `Verify Email to Activate Your Hexagon Account!`;
const emailVerificationBody = (firstName, lastName, emailVerificationLink) => {

  lastName = lastName ? ` ${lastName}` : ``;
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
  </head>
  <body style="font-family: Arial, sans-serif; font-size: 14px; background-color: #ffffff; margin: 0;">

    <div style="max-width: 600px; background: #ffffff; padding: 20px 40px; margin: auto; text-align: left;">
      <div style="text-align: center;">
        <img src="${logo_nobg_96}" alt="Hexagon Logo" style="width: 100px;">
      </div>
      <h2 style="color: #333;">Verify Your Email</h2>
      <p>Dear <strong>${firstName}${lastName}</strong>,</p>
      <p>Thank you for signing up with Hexagon! Please verify your email to activate your account.</p>
      <a href="${emailVerificationLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 16px; text-decoration: none; font-weight: bold; border-radius: 5px;">Verify My Email</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best Regards, <br> <strong>The Hexagon Team</strong></p>

      <div style="text-align: center; padding-top: 40px; font-size: 12px; color: #777;">
        &copy; 2025 Hexagon. All rights reserved. <br>
        <a href="${website}" style="color: #777;">Visit Our Website</a> |
        <a href="${support}" style="color: #777;">Contact Support</a>
      </div>
    </div>

  </body>
  </html>
  `;
};

const welcomeEmailSubject = `Welcome to Hexagon! Account is Successfully Created!`;
const welcomeEmailBody = (firstName, lastName) => {

  lastName = lastName ? ` ${lastName}` : ``;
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Hexagon!</title>
  </head>
  <body style="font-family: Arial, sans-serif; font-size: 14px; background-color: #ffffff; margin: 0;">

    <div style="max-width: 600px; background: #ffffff; padding: 20px 40px; margin: auto; text-align: left; margin-top: 20px;">
      <div style="text-align: center;">
        <img src="${logo_nobg_96}" alt="Hexagon Logo" style="width: 100px;">
      </div>
      <h2 style="color: #333;">Welcome to Hexagon!</h2>
      <p>Dear <strong>${firstName}${lastName}</strong>,</p>
      <p>Your email has been successfully verified, and your account is now activated.</p>
      <a href="${website}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 16px; text-decoration: none; font-weight: bold; border-radius: 5px;">Go to Dashboard</a>
      <p>We’re excited to have you onboard!</p>
      <p>Best Regards, <br> <strong>The Hexagon Team</strong></p>

      <div style="text-align: center; padding-top: 40px; font-size: 12px; color: #777;">
        &copy; 2025 Hexagon. All rights reserved. <br>
        <a href="${website}" style="color: #777;">Visit Our Website</a> |
        <a href="${support}" style="color: #777;">Contact Support</a>
      </div>
    </div>

  </body>
  </html>
  `;
};

const accountDeletetionEmailSubject = `Hexagon Account Deleted - We'll Miss You!`;
const accountDeletetionEmailBody = (firstName, lastName, email) => {

  lastName = lastName ? ` ${lastName}` : ``;
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deletion Confirmation</title>
  </head>
  <body style="font-family: Arial, sans-serif; font-size: 14px; background-color: #ffffff; margin: 0;">

    <div style="max-width: 600px; background: #ffffff; padding: 20px 40px; margin: auto; text-align: left; margin-top: 20px;">
      <div style="text-align: center;">
        <img src="${logo_nobg_96}" alt="Hexagon Logo" style="width: 100px;">
      </div>
      <h2 style="color: #333;">Account Deletion Confirmation</h2>
      <p>Dear <strong>${firstName}${lastName}</strong>,</p>
      <p>Your account associated with <strong>${email}</strong> has been successfully deleted.</p>
      <a href="${support}" style="display: inline-block; background-color: #ff3b30; color: #ffffff; padding: 10px 16px; text-decoration: none; font-weight: bold; border-radius: 5px;">Contact Support</a>
      <p>We're sorry to see you go. If you ever decide to return, we’d love to welcome you back!</p>
      <p>Best Regards, <br> <strong>The Hexagon Team</strong></p>

      <div style="text-align: center; padding-top: 40px; font-size: 12px; color: #777;">
        &copy; 2025 Hexagon. All rights reserved. <br>
        <a href="${website}" style="color: #777;">Visit Our Website</a> |
        <a href="${support}" style="color: #777;">Contact Support</a>
      </div>
    </div>

  </body>
  </html>
  `;
};

export {
  welcomeEmailSubject,
  welcomeEmailBody,
  emailVerificationSubject,
  emailVerificationBody,
  accountDeletetionEmailSubject,
  accountDeletetionEmailBody,
};
