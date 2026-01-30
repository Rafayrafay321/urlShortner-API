// Node Modules.
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

// Custom Modules.
import corsOptions from '@/lib/cors';
import router from '@/routes';
import errorHandler from '@/middleware/errorHandler';

// Initial express.
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(compression());
app.use(cors(corsOptions));

// Register application routes under the root path
app.use('/', router);

// global Error Handeler
app.use(errorHandler);

export default app;
