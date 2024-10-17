export type UploadInput = {
  path: Express.Multer.File["path"];
  folderName?: string;
};

export type UploadInputMultiple = {
  files: Express.Multer.File[];
  folderName?: string;
};
