// Node modules
import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';

// Custom imports
import config from '@/config';

if (config.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const connectOptions: ConnectOptions = {
  family: 4,
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

const connectDatabase = async (): Promise<void> => {
  if (!config.MONGO_CONNECTION_URI) {
    throw new Error('MongoDB URI is missing');
  }
  mongoose.connection.on('connected', () =>
    console.log('Mongoose conected to DB.'),
  );
  mongoose.connection.on('error', (err) =>
    console.log('Mongoose conection error.', err),
  );

  try {
    await mongoose.connect(config.MONGO_CONNECTION_URI, connectOptions);

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Mongoose connected but readystate is not 1');
    }
  } catch (error) {
    console.error('Database connection failed!', error);
    throw error;
  }
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Database disconnected!');
  } catch (error) {
    console.log('Error during database disconnection!', error);
  }
};

export { connectDatabase, disconnectDatabase };
