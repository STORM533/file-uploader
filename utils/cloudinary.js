import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

// Uploads a local file buffer/path to Cloudinary and returns the secure URL.
// Returns null if Cloudinary is not configured (CLOUDINARY_URL empty).
async function uploadToCloudinary(filePath, folder = "file-uploader") {
  if (!process.env.CLOUDINARY_URL) {
    return null;
  }
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
  });
  return result.secure_url;
}

export { cloudinary, uploadToCloudinary };