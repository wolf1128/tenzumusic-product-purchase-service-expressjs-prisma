import { Router } from 'express';
import { getUser, registerUser } from '../controllers/userController';
const router = Router();

router.post('/', registerUser);
router.post('/info', getUser);

export default router;
