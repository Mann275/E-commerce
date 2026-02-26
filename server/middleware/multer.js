import multer from "multer";

const storage = multer.memoryStorage();

// Single file upload
export const uploadSingle = multer({ storage }).single("file");

// Multiple file upload
export const uploadMultiple = multer({ storage }).array("productImg", 10);
