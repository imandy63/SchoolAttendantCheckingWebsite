import multer from "multer";

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.filename}`);
    },
    destination: (req, file, cb) => {
      cb(null, "./src/uploads");
    },
  }),
});

export { uploadMemory, uploadDisk };
