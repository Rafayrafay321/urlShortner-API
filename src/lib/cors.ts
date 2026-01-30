// Node Modules
import type { CorsOptions } from 'cors';

// Custom Modules
import config from '@/config';

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin) {
      return callback(null, true);
    }

    if (requestOrigin && config.CORS_WHITELIST.includes(requestOrigin)) {
      return callback(null, true);
    }

    if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
};

export default corsOptions;
