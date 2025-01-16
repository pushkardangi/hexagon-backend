import mongoose from "mongoose";

const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
      console.log(`MongoDB connected successfully!! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
      console.error("Error while connecting DB:", error);
      process.exit(1);
    }
};

export default connectDB;
