import { Router } from 'express';
import * as messageController from '../controllers/message.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { attachBatchAccess } from '../middlewares/batchAccess.middleware';

const router = Router();

router.use(requireAuth, attachBatchAccess);

router.get('/:chatId', messageController.getMessages);
router.patch('/:id', messageController.editMessage);
router.delete('/:id', messageController.deleteMessage);
router.post('/:id/react', messageController.reactToMessage);
router.post('/:id/pin', messageController.togglePinMessage);

export default router;