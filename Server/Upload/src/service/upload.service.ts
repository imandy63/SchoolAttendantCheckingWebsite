import { cloud } from "../configs/config.cloudinary";
import { BadRequestError } from "../core/error.response";
import { UploadInput } from "../interfaces/upload.interface";

class UploadService {
  static uploadImageFromLocal = async ({
    buffer,
    folderName = "datn",
  }: UploadInput) => {
    const publicId = `image_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    try {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloud.uploader.upload_stream(
          { public_id: publicId, folder: folderName },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      const result: any = await uploadPromise;

      return {
        image_url: result.secure_url,
        thumb_url: cloud.url(result.public_id, {
          format: "jpg",
        }),
      };
    } catch (err) {
      console.log("Error::", err);
      throw new BadRequestError("Can't upload thumb");
    }
  };
}

export { UploadService };
