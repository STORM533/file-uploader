import { prisma } from "../lib/prisma.js";

const getUploadForm = async (req, res, next) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      orderBy: { name: "asc" },
    });
    res.render("files/upload", {
      folders,
      folderId: req.query.folderId || "",
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).render("files/upload", {
        folders: [],
        folderId: req.body.folderId || "",
        error: "No file attached.",
      });
    }
    const folderId = req.body.folderId ? parseInt(req.body.folderId, 10) : null;
    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId: req.user.id },
      });
      if (!folder) {
        return res.status(400).render("files/upload", {
          folders: [],
          folderId: "",
          error: "Unknown shelf.",
        });
      }
    }
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        localPath: req.file.path,
        folderId,
        userId: req.user.id,
      },
    });
    if (folderId) return res.redirect(`/folders/${folderId}`);
    res.redirect("/files");
  } catch (err) {
    next(err);
  }
};

const listFiles = async (req, res, next) => {
  try {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      orderBy: { uploadedAt: "desc" },
      include: { folder: true },
    });
    res.render("files/index", { files });
  } catch (err) {
    next(err);
  }
};

export { getUploadForm, uploadFile, listFiles };