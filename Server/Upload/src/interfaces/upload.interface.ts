export type UploadInput = {
  buffer: Express.Multer.File["buffer"];
  folderName?: string;
};
