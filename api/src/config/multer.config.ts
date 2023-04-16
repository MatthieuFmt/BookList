import { Request } from "express";
import path from "path";
import multer, { FileFilterCallback } from "multer";

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limite la taille du fichier à 1MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    checkFileType(file, cb);
  },
}).single("profileImage");

// Vérifie le type de fichier
function checkFileType(
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error("Seules les images au format JPEG, JPG ou PNG sont autorisées.")
    );
  }
}
