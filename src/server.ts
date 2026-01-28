// Node Modules.
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

// Custom Modules.
import config from '@/config';
import corsOptions from '@/lib/cors';
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose';
import router from '@/routes';
import errorHandler from '@/middleware/errorHandler';

// Initial express.
const server = express();

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(`${__dirname}/public`));
server.use(cookieParser());
server.use(compression());
server.use(cors(corsOptions));

(async (): Promise<void> => {
  try {
    // Establishing MongoDB connection!
    await connectDatabase();

    // Register application routes under the root path
    server.use('/', router);

    // global Error Handeler
    server.use(errorHandler);

    // Start the server and listen on the configured port.
    server.listen(config.PORT, () => {
      console.log(`Server listening at http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.log('Faild to start Server', error);

    // In production, exit the process to avoid unstable state.
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

// handle gracefull server shutdown on termination signals (e.g: SIGINT,SIGTERM)
const serverTermination = async (signal: NodeJS.Signals): Promise<void> => {
  try {
    disconnectDatabase();
    console.log('Server Shutdown', signal);
    process.exit(0);
  } catch (error) {
    console.log('Error during server shutdown:', error);
  }
};

process.on('SIGINT', serverTermination);
process.on('SIGTERM', serverTermination);
