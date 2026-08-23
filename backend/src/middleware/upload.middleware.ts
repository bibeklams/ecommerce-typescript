import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/", "video/", "application/pdf"];

    const isAllowed = allowedTypes.some((type) =>
      file.mimetype.startsWith(type),
    );

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("Only images, videos, and PDF files are allowed"));
    }
  },
});

export default upload;
