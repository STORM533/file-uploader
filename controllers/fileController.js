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

const getFileDetails = async (req, res, next) => {
  try {
    const file = await prisma.file.findFirst({
      where: { id: parseInt(req.params.id, 10), userId: req.user.id },
      include: { folder: true },
    });
    if (!file) return res.redirect("/files");
    res.render("files/detail", { file });
  } catch (err) {
    next(err);
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const file = await prisma.file.findFirst({
      where: { id: parseInt(req.params.id, 10), userId: req.user.id },
    });
    if (!file) return res.redirect("/files");
    if (file.url) {
      return res.redirect(file.url);
    }
    if (file.localPath) {
      return res.download(file.localPath, file.name);
    }
    return res.status(404).render("files/detail", {
      file,
      error: "No parcel stored yet.",
    });
  } catch (err) {
    next(err);
  }
};

export { getUploadForm, uploadFile, listFiles, getFileDetails, downloadFile };