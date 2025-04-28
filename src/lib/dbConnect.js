import mongoose from 'mongoose';
import { seedAdmin } from '@/scripts/seedAdmin';
import env from './env';

const MONGODB_URI = env.database.url;

let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      const mongooseInstance = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    
      console.log("✅ MongoDB connected");
      await seedAdmin();
      return mongooseInstance;
    })();    
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
