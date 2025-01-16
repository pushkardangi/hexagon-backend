import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 3000;

try {
    await connectDB();
    app.listen(port, () => {
        console.log(`⚙️  Server is running on port: ${port}`);
    });
} catch (error) {
    console.error("Error starting the server:", error);
}
