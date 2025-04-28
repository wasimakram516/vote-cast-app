import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { jsonResponse } from "@/lib/jsonResponse";
import { Readable } from "stream";
import formidable from "formidable";
import fs from "fs"; 
import os from "os";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type");
    const contentLength = req.headers.get("content-length");

    if (!contentType) {
      return jsonResponse(400, "Missing content-type");
    }

    const form = formidable({
      multiples: false,
      uploadDir: os.tmpdir(),
      keepExtensions: true,
    });

    // Convert req.body into Readable stream
    const readable = Readable.fromWeb(req.body);

    // Make it compatible with formidable
    const fakeReq = Object.assign(readable, {
      headers: {
        "content-type": contentType,
        "content-length": contentLength || "0",
      },
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(fakeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file?.[0];
    if (!file) {
      return jsonResponse(400, "No file uploaded");
    }

    const fileBuffer = fs.readFileSync(file.filepath);

    const result = await uploadToCloudinary(fileBuffer, file.mimetype); 

    return jsonResponse(200, "File uploaded successfully", { url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return jsonResponse(500, "Upload failed", null, error.message);
  }
}
