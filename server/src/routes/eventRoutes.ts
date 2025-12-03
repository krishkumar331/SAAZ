import { Router } from 'express';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', authenticate, createEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;
