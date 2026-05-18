import express from 'express';
const router = express.Router();
import {
  createApplication,
  getApplications,
  updateApplicationStatus,
  downloadRequestZip,
} from '../controllers/applicationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

router.route('/')
  .get(protect, getApplications)
  .post(protect, upload.array('documents', 10), createApplication);

router.route('/:id').patch(protect, admin, updateApplicationStatus);
router.route('/:id/download-zip').get(protect, admin, downloadRequestZip);

export default router;
