import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/upload.js";
import {
  getUploadForm,
  uploadFile,
  listFiles,
  getFileDetails,
  downloadFile,
} from "../controllers/fileController.js";

const router = Router();

router.use(isAuthenticated);

router.get("/", listFiles);
router.get("/upload", getUploadForm);
router.get("/:id", getFileDetails);
router.get("/:id/download", downloadFile);
router.post("/upload", upload.single("file"), (err, req, res, next) => {
  if (err) {
    return res.status(400).render("files/upload", {
      folders: [],
      folderId: req.body.folderId || "",
      error: err.message,
    });
  }
  next();
}, uploadFile);

export default router;