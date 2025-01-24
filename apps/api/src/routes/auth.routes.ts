import { Router } from 'express';
import { validateLogin } from '../middleware/validators';
import { login, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router; 