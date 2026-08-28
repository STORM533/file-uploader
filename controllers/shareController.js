import { prisma } from "../lib/prisma.js";

const DURATIONS = {
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "10d": 10 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

const createShareLink = async (req, res, next) => {
  try {
    const folderId = parseInt(req.params.id, 10);
    const duration = req.body.duration || "1d";
    const ms = DURATIONS[duration] || DURATIONS["1d"];

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId: req.user.id },
    });
    if (!folder) return res.redirect("/folders");

    const shareLink = await prisma.shareLink.create({
      data: {
        folderId,
        expiresAt: new Date(Date.now() + ms),
      },
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const shareUrl = `${baseUrl}/share/${shareLink.id}`;
    res.render("folders/share-created", { shareUrl, duration });
  } catch (err) {
    next(err);
  }
};

const accessSharedFolder = async (req, res, next) => {
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: { id: req.params.id },
      include: {
        folder: {
          include: {
            files: true,
            children: { orderBy: { createdAt: "desc" } },
          },
        },
      },
    });

    if (!shareLink) {
      return res.status(404).render("share/access", { notFound: true });
    }

    if (shareLink.expiresAt < new Date()) {
      return res.status(410).render("share/access", {
        expired: true,
        folder: shareLink.folder,
        shareId: shareLink.id,
      });
    }

    res.render("share/access", {
      folder: shareLink.folder,
      shareId: shareLink.id,
    });
  } catch (err) {
    next(err);
  }
};

export { createShareLink, accessSharedFolder };