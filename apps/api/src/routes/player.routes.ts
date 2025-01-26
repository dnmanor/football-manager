import { Router } from "express";
import { updatePlayerRecord } from "../controllers/player.controller";
import { requireAuth } from "../middleware/auth";


const router = Router();
router.use(requireAuth)

router.patch('/:id', updatePlayerRecord);


export default router