import { cloud } from "../config/config.cloudinary";
import { BadRequestError } from "../core/error.response";
import {
  UploadInput,
  UploadInputMultiple,
} from "../interface/upload.interface";

class UploadService {
  static uploadImageFromLocal = async ({ buffer }: UploadInput) => {
    try {
      const result = await cloud.uploader.upload(path, {
        public_id: "thumb",
        folder: folderName,
      });
      return {
        image_url: result.secure_url,
        shopId: 1111,
        thumb_url: cloud.url(result.public_id, {
          height: 200,
          width: 200,
          format: "jpg",
        }),
      };
    } catch (err) {
      console.log("Error::", err);
      throw new BadRequestError("Can't upload thumb");
    }
  };

  static uploadImageFromLocalFiles = async ({
    files,
    folderName = "product/unused_product_image",
  }: UploadInputMultiple) => {
    try {
      if (!files.length) {
        return;
      }

      const uploads = [];

      for (const file of files) {
        const result = await cloud.uploader.upload(file.path, {
          folder: folderName,
        });

        uploads.push({
          image_url: result.secure_url,
          shopId: 1111,
          thumb_url: cloud.url(result.public_id),
        });
      }

      return uploads;
    } catch (err) {
      console.log("Error::", err);
      throw new BadRequestError("Can't upload images");
    }
  };
}

export { UploadService };
