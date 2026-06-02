import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'textarea', 'number', 'email', 'date', 'select', 'radio', 'checkbox', 'file', 'image', 'pdf'],
    required: true,
  },
  label: { type: String, required: true },
  labelHindi: String,
  placeholder: String,
  placeholderHindi: String,
  required: { type: Boolean, default: false },
  options: [String], // For select, radio, checkbox
  validation: {
    min: Number,
    max: Number,
    pattern: String,
  },
  order: { type: Number, default: 0 },
});

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleHindi: String,
  description: String,
  descriptionHindi: String,
  category: {
    type: String,
    required: true,
  },
  categoryHindi: String,
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  estimatedTime: String,
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  formSchema: [fieldSchema],
  instructions: [String],
  instructionsHindi: [String],
  requiredDocuments: [String], // General documents needed
  requiredDocumentsHindi: [String],
  image: String,
  isPopular: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
