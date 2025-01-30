import { logo96x96 } from "./app-assets.constants.js";

const accountDeletetionConfirmationSubject = `Hexagon Account Deletion Confirmation!`;
const accountDeletetionConfirmationEmail = (firstName, lastName, email) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deletion Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
    }
    .header img {
      width: 120px;
    }
    .content {
      padding: 20px;
      color: #333333;
      font-size: 16px;
      line-height: 1.6;
    }
    .content p {
      margin: 10px 0;
    }
    .button {
      display: inline-block;
      margin: 20px auto;
      padding: 6px 16px;
      background-color: #ff3b30;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #888888;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <img src="${logo96x96}" alt="Hexagon Logo">
    </div>

    <div class="content">
      <h2>Account Deletion Confirmation</h2>
      <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
      <p>Your account associated with <strong>${email}</strong> has been successfully deleted as per your request.</p>

      <p>If this was intentional, no further action is needed. However, if you did not request this, please contact our support team immediately.</p>

      <p>We're sorry to see you go. If you ever decide to return, we'd love to welcome you back!</p>

      <a href="https://hexagon.pushkarweb.dev/support"><div class="button">Contact Support</div></a>
    </div>

    <div class="footer">
      &copy; 2024 Hexagon. All rights reserved. <br>
      <a href="https://hexagon.pushkarweb.dev" style="color: #888;">Visit Our Website</a>
    </div>
  </div>

</body>
</html>`;
};

export {
  accountDeletetionConfirmationSubject,
  accountDeletetionConfirmationEmail,
};
