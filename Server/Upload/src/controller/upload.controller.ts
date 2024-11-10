import { NextFunction, Request, Response } from "express";
import { UploadService } from "../service/upload.service";
import { BadRequestError } from "../core/error.response";
import { CREATED } from "../core/success.response";

class UploadController {
  static uploadThumb = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("Missing file");
    }
    new CREATED({
      message: "Upload successfully",
      metadata: await UploadService.uploadImageFromLocal({
        buffer: file.buffer,
      }),
    }).send(res);
  };
}

export default UploadController;
