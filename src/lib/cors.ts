// Node Modules
import type { CorsOptions } from 'cors';

// Custom Modules
import config from '@/config';

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (requestOrigin && config.CORS_WHITELIST.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(
        config.NODE_ENV === 'development'
          ? null
          : new Error('Not allowed by CORS'),
      );
    }
  },
};

export default corsOptions;
