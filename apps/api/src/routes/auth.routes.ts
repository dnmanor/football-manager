import { Router } from "express";
import { getCurrentUser, login, logout } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);

router.use(requireAuth)
router.get("/me", getCurrentUser);

export default router;
