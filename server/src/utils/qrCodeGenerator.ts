import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { uploadOnCloudinary } from "./cloudinary"; // Note the .js extension for NodeNext

export const generateQRCodeAndUpload = async (text: string, name: string = "qr-code"): Promise<string | null> => {
  try {
    const fileName = `${name}-${Date.now()}.png`;

    // 2. Define the directory path explicitly
    const dirPath = path.join(process.cwd(), "public", "temp");

    // 3. CRITICAL FIX: Create the directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    // Ensure the public/temp directory exists
    const filePath = path.join(process.cwd(), "public", "temp", fileName);

    await QRCode.toFile(filePath, text, {
      width: 300,
      margin: 2,
    });

    const cloudinaryResult = await uploadOnCloudinary(filePath);
    return cloudinaryResult?.secure_url || null;
  } catch (error) {
    console.error("QR Code generation/upload failed:", error);
    return null;
  }
};