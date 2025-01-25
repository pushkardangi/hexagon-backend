import { v2 as cloudinary } from "cloudinary";

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

const deleteFileOnCloudinary = async (publicId, resourceType) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(`Failed deleting file on cloudinary: ${error?.message}`);
  }
};

export { uploadOnCloudinary, deleteFileOnCloudinary };
