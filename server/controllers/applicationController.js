import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import Request from '../models/Request.js';
import cloudinary from '../config/cloudinary.js';

// Helper: Upload a single local file to Cloudinary and delete local copy
const uploadToCloudinaryAndClean = async (filePath, originalname, mimetype) => {
  const isImage = mimetype.startsWith('image/');
  const isPdf = mimetype === 'application/pdf';

  const resourceType = isImage ? 'image' : 'raw';
  const folder = isImage ? 'service-requests/images' : 'service-requests/documents';

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    folder,
    use_filename: true,
    unique_filename: true,
  });

  // Delete local temp file after successful Cloudinary upload
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Failed to delete temp file: ${filePath}`, err);
  });

  return {
    fileUrl: result.secure_url,
    publicId: result.public_id,
  };
};

// Helper: Download a file from a URL and return a readable stream
const downloadFileFromUrl = (fileUrl) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(fileUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    protocol.get(fileUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch file: HTTP ${response.statusCode} for ${fileUrl}`));
        return;
      }
      resolve(response);
    }).on('error', reject);
  });
};

// @desc    Create new service request (with file uploads to Cloudinary)
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res) => {
  try {
    const { serviceId, amount, tenantId } = req.body;

    // formData is sent as a JSON string in multipart form
    let formData = {};
    if (req.body.formData) {
      try {
        formData = JSON.parse(req.body.formData);
      } catch {
        formData = req.body.formData;
      }
    }

    if (!serviceId || !formData) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Upload each file to Cloudinary and collect document info
    const documents = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const { fileUrl, publicId } = await uploadToCloudinaryAndClean(
            file.path,
            file.originalname,
            file.mimetype
          );

          documents.push({
            fieldName: file.fieldname,
            fileName: file.originalname,
            fileUrl,
            fileType: file.mimetype,
            publicId,
          });
        } catch (uploadErr) {
          console.error(`Cloudinary upload failed for file ${file.originalname}:`, uploadErr);
          // Clean up local file even if upload fails
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }
    }

    const request = await Request.create({
      service: serviceId,
      customer: req.user._id,
      tenant: tenantId || req.user.tenant,
      formData,
      documents,
      amount: amount || 0,
      status: 'pending',
    });

    if (request) {
      res.status(201).json(request);
    } else {
      res.status(400);
      throw new Error('Invalid request data');
    }
  } catch (err) {
    // Clean up any remaining temp files on error
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    throw err;
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

// @desc    Download all documents for a request as ZIP (fetched from Cloudinary)
// @route   GET /api/applications/:id/download-zip
// @access  Private/Admin
const downloadRequestZip = async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (!request.documents || request.documents.length === 0) {
    res.status(404);
    throw new Error('No documents found for this request');
  }

  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="request-${request._id}.zip"`);

  archive.on('error', (err) => {
    console.error('Archive error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error creating ZIP file' });
    }
  });

  archive.pipe(res);

  // Download each document from Cloudinary and append to ZIP
  for (const doc of request.documents) {
    if (doc.fileUrl) {
      try {
        const fileStream = await downloadFileFromUrl(doc.fileUrl);
        archive.append(fileStream, { name: doc.fileName || `document-${doc.publicId}` });
      } catch (err) {
        console.error(`Failed to download file ${doc.fileName} from Cloudinary:`, err.message);
        // Continue with other files even if one fails
      }
    }
  }

  await archive.finalize();
};

export { createApplication, getApplications, updateApplicationStatus, downloadRequestZip };
