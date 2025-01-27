import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getUserTeam } from "../controllers/user.controller";


const router = Router();
router.use(requireAuth)

router.get('/team', getUserTeam);


export default router