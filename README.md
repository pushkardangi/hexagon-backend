# Hexagon - Image Generation Web App Backend

This is the backend for an AI-powered image generation web application. It uses the OpenAI API to generate images based on user prompts, stores the generated images in Cloudinary, and uses MongoDB to store user profiles and Cloudinary secure URLs. The backend is built using **Node.js** and **Express**.

[Hexagon Frontend](https://github.com/pushkardangi/hexagon-client)

## Features

- Generate images using the OpenAI API.
- Store generated images in Cloudinary for efficient storage and retrieval.
- Store user profiles and image data in MongoDB.
- Expose RESTful endpoints for frontend integration.

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

You will also need:

1. An OpenAI API key.
2. A Cloudinary account with API credentials.
3. A MongoDB database.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add the following:

   ```env
   PORT=3000
   CORS_ORIGIN=<your-allowed-cors-origin>

   MONGODB_URI=<your-mongodb-connection-string>
   DB_NAME=<your-database-name>

   OPENAI_API_KEY=<your-openai-api-key>

   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```

### Environment Variables

| Variable               | Description                         |
|------------------------|-------------------------------------|
| `PORT`                 | Port for the server to run on       |
| `CORS_ORIGIN`          | Allowed CORS origin                 |
| `MONGODB_URI`          | MongoDB connection string           |
| `DB_NAME`              | Name of the MongoDB database        |
| `OPENAI_API_KEY`       | API key for OpenAI                  |
| `CLOUDINARY_CLOUD_NAME`| Your Cloudinary cloud name          |
| `CLOUDINARY_API_KEY`   | API key for Cloudinary              |
| `CLOUDINARY_API_SECRET`| API secret for Cloudinary           |

## Usage

1. Start the server:

   ```bash
   npm run dev
   ```

2. The backend will run on `http://localhost:3000` by default.

## Project Structure

```plaintext

├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   └── utils
├── app.js                  # Main app setup
├── index.js                # Entry point of the application
├── .env                    # Environment variables
├── .gitattributes          # Git configuration
├── .gitignore              # Files and directories to ignore in Git
├── .prettierignore         # Files and directories to ignore by Prettier
├── .prettierrc             # Prettier configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Detailed tree of dependencies
└── README.md               # Project documentation
```

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.
