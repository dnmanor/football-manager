import { Router } from "express";
import { updatePlayerRecord, purchasePlayer, getAvailablePlayers } from "../controllers/player.controller";
import { requireAuth } from "../middleware/auth";


const router = Router();
router.use(requireAuth)

router.patch('/:id', updatePlayerRecord);
router.post('/:id/purchase', purchasePlayer);
router.get('/available', getAvailablePlayers)


export default router