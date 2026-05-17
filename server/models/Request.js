import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  formData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  documents: [{
    fieldName: String,
    fileName: String,
    fileUrl: String,
    fileType: String,
    publicId: String, // For Cloudinary
  }],
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending',
  },
  remarks: [String],
  amount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentId: String,
}, {
  timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);
export default Request;
