import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file.",
        },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "nexhack";

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided in form data" },
          { status: 400 }
        );
      }

      // Convert file to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadImageToCloudinary(buffer, { folder });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    // 2. JSON Body (base64 data URI or remote URL)
    const body = await req.json();
    const { image, folder = "nexhack" } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image (base64 or URL) provided in JSON body" },
        { status: 400 }
      );
    }

    const result = await uploadImageToCloudinary(image, { folder });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image to Cloudinary",
      },
      { status: 500 }
    );
  }
}
