import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  buffer: Buffer,
  folder: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          timeout: 30000,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      )
      .end(buffer);
  });
}

export async function uploadVideo(
  buffer: Buffer,
  folder: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "video",
          timeout: 120000,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      )
      .end(buffer);
  });
}

export default cloudinary;
