import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getUserTeam, getUserTransferHistory } from "../controllers/user.controller";


const router = Router();
router.use(requireAuth)

router.get('/team', getUserTeam);
router.get('/transfer-history', getUserTransferHistory);    

export default router
