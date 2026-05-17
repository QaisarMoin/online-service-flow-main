import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop leftover referralCode_1 index if it exists to prevent registration crashes
    try {
      await mongoose.connection.db.collection('users').dropIndex('referralCode_1');
      console.log('Successfully dropped old referralCode_1 index');
    } catch (indexErr) {
      // Silence error if the index does not exist (already dropped or new database)
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit process, let it try to stay up for basic API health
  }
};

export default connectDB;
