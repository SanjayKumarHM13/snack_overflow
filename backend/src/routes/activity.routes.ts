import { Router } from 'express';
import { activityController } from '../controllers/activity.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validateQuery } from '../middleware/validate.middleware.js';
import { queryActivitySchema } from '../validators/activity.validator.js';

export const activityRouter = Router();

// Paginated activity audit log (Admin only)
activityRouter.get(
  '/',
  authenticate,
  requireAdmin,
  validateQuery(queryActivitySchema),
  (req, res, next) => activityController.listActivities(req, res, next)
);
