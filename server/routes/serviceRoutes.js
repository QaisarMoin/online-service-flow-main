import express from 'express';
const router = express.Router();
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getServices).post(protect, admin, createService);
router.route('/:id')
  .get(getServiceById)
  .patch(protect, admin, updateService)
  .delete(protect, admin, deleteService);

export default router;
