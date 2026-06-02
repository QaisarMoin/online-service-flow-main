import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Tenant from './models/Tenant.js';
import Service from './models/Service.js';
import { services as initialServices } from '../src/data/services.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Tenant.deleteMany();
    await Service.deleteMany();

    // 1. Create Default Tenant
    const tenant = await Tenant.create({
      name: 'Main Virtual Shop',
      slug: 'main-shop',
      description: 'The primary shop for all digital services.',
    });

    // 2. Create Default Admin User
    const admin = await User.create({
      name: 'Admin Qaisar',
      email: 'qaisarashraf685@gmail.com',
      password: 'qaisarashraf685@gmail.com',
      role: 'super_admin',
      tenant: tenant._id,
    });

    // Update tenant owner
    tenant.owner = admin._id;
    await tenant.save();

    // 3. Create Services
    const servicesToCreate = initialServices.map(s => ({
      ...s,
      tenant: tenant._id,
      // Add a basic form schema for each service
      formSchema: [
        { type: 'text', label: 'Full Name', required: true, order: 1 },
        { type: 'email', label: 'Email Address', required: true, order: 2 },
        { type: 'text', label: 'Phone Number', required: true, order: 3 },
        { type: 'textarea', label: 'Additional Notes', order: 4 },
        ...s.requiredDocuments.map((doc, idx) => ({
          type: 'file',
          label: `Upload ${doc}`,
          required: true,
          order: 5 + idx
        }))
      ]
    }));

    await Service.insertMany(servicesToCreate);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
    //vbds
  }
};

seedData();
