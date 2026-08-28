import { Router } from "express";
import { body } from "express-validator";
import { validationResult } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  listFolders,
  getNewFolder,
  createFolder,
  getFolder,
  getRenameFolder,
  renameFolder,
  deleteFolder,
} from "../controllers/folderController.js";

const router = Router();

const folderValidator = [
  body("name").trim().notEmpty().withMessage("A shelf name is required."),
];

router.use(isAuthenticated);

router.get("/", listFolders);
router.get("/new", getNewFolder);
router.post(
  "/",
  folderValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("folders/new", {
        errors: errors.array(),
        name: req.body.name,
        parentId: req.body.parentId || "",
      });
    }
    next();
  },
  createFolder,
);

router.get("/:id", getFolder);
router.get("/:id/rename", getRenameFolder);
router.post(
  "/:id/rename",
  folderValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("folders/rename", {
        folder: { id: req.params.id, name: req.body.name },
        errors: errors.array(),
      });
    }
    next();
  },
  renameFolder,
);

router.post("/:id/delete", deleteFolder);

export default router;