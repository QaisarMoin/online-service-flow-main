import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  logo: String,
  settings: {
    primaryColor: { type: String, default: '#3b82f6' },
    allowCustomServices: { type: Boolean, default: true },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;
