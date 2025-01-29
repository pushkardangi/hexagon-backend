import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const uploadOnCloudinary = async (resource, resource_type, folder, tags) => {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!resource || !resource_type) {
      console.error("Resource or Resource type are missing!");
    }
    if (!folder || !tags) {
      console.error("Folder or tags are missing!");
    }

    const response = await cloudinary.uploader.upload(resource, {
      unique_filename: true,
      resource_type,
      folder: `openai/${folder}`,
      tags,
    });

    return response;
  } catch (error) {
    console.error(`File upload on cloudinary failed: ${error?.message}`);
  }
};

const deleteFileOnCloudinary = async (publicId, resourceType = "image") => {
  try {
    const uploading = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType, // Explicitly set the resource type
    });                            // important when deleting video files

    if (uploading.result !== "ok") {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting file on Cloudinary:", error);
    return false;
  }
};

const uploadOnCloudinaryUsingStream = async (buffer, resource_type, folder, tags = [], transform) => {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          unique_filename: true,
          resource_type,
          folder,
          tags,
          transformation: transform && { width: 500, height: 500, crop: "fill" },
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error(`Error uploading file on cloudinary: ${error?.message}`);
  }
};

export {
  uploadOnCloudinary,
  uploadOnCloudinaryUsingStream,
  deleteFileOnCloudinary,
};
