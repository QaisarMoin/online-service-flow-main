import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import Request from '../models/Request.js';

// @desc    Create new service request
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  const {
    serviceId,
    formData,
    documents,
    amount,
    tenantId
  } = req.body;

  if (!serviceId || !formData) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const request = await Request.create({
    service: serviceId,
    customer: req.user._id,
    tenant: tenantId || req.user.tenant,
    formData,
    documents: documents || [],
    amount,
    status: 'pending',
  });

  if (request) {
    res.status(201).json(request);
  } else {
    res.status(400);
    throw new Error('Invalid request data');
  }
};

// @desc    Get all requests (Admin) or user's requests
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res) => {
  let filter = {};
  
  if (req.user.role === 'customer') {
    filter.customer = req.user._id;
  } else if (req.user.role === 'admin') {
    filter.tenant = req.user.tenant;
  }
  // super_admin sees all if no tenant filter

  const requests = await Request.find(filter)
    .populate('service', 'title category')
    .populate('customer', 'name email')
    .sort('-createdAt');

  res.json(requests);
};

// @desc    Update request status
// @route   PATCH /api/applications/:id
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  const { status, remarks } = req.body;
  const request = await Request.findById(req.params.id);

  if (request) {
    request.status = status || request.status;
    if (remarks) request.remarks.push(remarks);
    
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error('Request not found');
  }
};

// @desc    Download all documents for a request as ZIP
// @route   GET /api/applications/:id/download-zip
// @access  Private/Admin
const downloadRequestZip = async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  res.attachment(`request-${request._id}.zip`);

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(res);

  for (const doc of request.documents) {
    if (doc.fileUrl) {
      const filePath = path.join(process.cwd(), doc.fileUrl);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: doc.fileName });
      }
    }
  }

  await archive.finalize();
};

export { createApplication, getApplications, updateApplicationStatus, downloadRequestZip };
