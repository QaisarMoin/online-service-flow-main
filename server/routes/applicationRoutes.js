import express from 'express';
const router = express.Router();
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
  downloadRequestZip,
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, getApplications)
  .post(protect, createApplication);

router.route('/:id').patch(protect, admin, updateApplicationStatus);
router.route('/:id/download-zip').get(protect, admin, downloadRequestZip);

export default router;
