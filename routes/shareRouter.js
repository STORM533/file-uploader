import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createShareLink, accessSharedFolder } from "../controllers/shareController.js";

const router = Router();

// Authenticated: owner creates a share link for one of their folders
router.post("/folders/:id/share", isAuthenticated, createShareLink);

// Public: anyone with the ticket can view the folder read-only
router.get("/share/:id", accessSharedFolder);

export default router;