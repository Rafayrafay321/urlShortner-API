// Custom Modules.
import app from '@/app';
import config from '@/config';
import logger from '@/lib/winston';
import { connectDatabase, disconnectDatabase } from '@/lib/mongoose';

(async (): Promise<void> => {
  try {
    // Establishing MongoDB connection!
    await connectDatabase();

    // Start the server and listen on the configured port.
    app.listen(config.PORT, () => {
      logger.info(`Server listening at http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start Server', { error });

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
    logger.info('Server Shutdown', { signal });
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown:', { error });
  }
};

process.on('SIGINT', serverTermination);
process.on('SIGTERM', serverTermination);
