import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { snackRouter } from './snack.routes.js';
import { activityRouter } from './activity.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/snacks', snackRouter);
apiRouter.use('/activities', activityRouter);
