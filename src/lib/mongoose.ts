// Node modules
import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';

// Custom imports
import config from '@/config';
import logger from './winston';

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
    logger.info('Mongoose connected to DB.'),
  );
  mongoose.connection.on('error', (err) =>
    logger.error('Mongoose connection error.', { error: err }),
  );

  try {
    await mongoose.connect(config.MONGO_CONNECTION_URI, connectOptions);

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Mongoose connected but readystate is not 1');
    }
  } catch (error) {
    logger.error('Database connection failed!', { error });
    throw error;
  }
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected!');
  } catch (error) {
    logger.error('Error during database disconnection!', { error });
  }
};

export { connectDatabase, disconnectDatabase };
