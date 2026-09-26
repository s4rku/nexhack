import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Checks if Cloudinary credentials are provided in the environment.
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET) ||
      process.env.CLOUDINARY_URL
  );
}

/**
 * Uploads an image (Buffer, base64 string, or remote URL) to Cloudinary.
 */
export async function uploadImageToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: object[];
  } = {}
): Promise<UploadApiResponse> {
  const folder = options.folder || "nexhack";

  // If buffer is provided, use upload_stream
  if (Buffer.isBuffer(file)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: options.publicId,
          resource_type: "image",
          transformation: options.transformation || [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(file);
    });
  }

  // If base64 or remote URL string is provided
  return cloudinary.uploader.upload(file, {
    folder,
    public_id: options.publicId,
    resource_type: "image",
    transformation: options.transformation || [{ quality: "auto", fetch_format: "auto" }],
  });
}

/**
 * Deletes an image from Cloudinary by its publicId.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<any> {
  return cloudinary.uploader.destroy(publicId);
}
