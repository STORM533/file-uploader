import { prisma } from "../lib/prisma.js";

const listFolders = async (req, res, next) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { files: true, children: true } },
      },
    });
    res.render("folders/index", { folders });
  } catch (err) {
    next(err);
  }
};

const getNewFolder = (req, res) => {
  res.render("folders/new", { errors: [], name: "", parentId: req.query.parentId || "" });
};

const createFolder = async (req, res, next) => {
  try {
    const name = req.body.name.trim();
    const parentId = req.body.parentId ? parseInt(req.body.parentId, 10) : null;
    await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
        parentId,
      },
    });
    if (parentId) return res.redirect(`/folders/${parentId}`);
    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

const getFolder = async (req, res, next) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: { id: parseInt(req.params.id, 10), userId: req.user.id },
      include: {
        files: true,
        children: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!folder) return res.redirect("/folders");
    res.render("folders/show", { folder });
  } catch (err) {
    next(err);
  }
};

const getRenameFolder = async (req, res, next) => {
  try {
    const folder = await prisma.folder.findFirst({
      where: { id: parseInt(req.params.id, 10), userId: req.user.id },
    });
    if (!folder) return res.redirect("/folders");
    res.render("folders/rename", { folder, errors: [] });
  } catch (err) {
    next(err);
  }
};

const renameFolder = async (req, res, next) => {
  try {
    const name = req.body.name.trim();
    await prisma.folder.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { name },
    });
    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

const deleteFolder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const folder = await prisma.folder.findFirst({
      where: { id, userId: req.user.id },
      include: {
        files: true,
        children: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!folder) return res.redirect("/folders");
    if (folder.files.length > 0 || folder.children.length > 0) {
      return res.status(400).render("folders/show", {
        folder,
        error: "Shelf not empty. Remove its parcels and sub-shelves before clearing it.",
      });
    }
    await prisma.folder.delete({ where: { id } });
    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
};

export {
  listFolders,
  getNewFolder,
  createFolder,
  getFolder,
  getRenameFolder,
  renameFolder,
  deleteFolder,
};