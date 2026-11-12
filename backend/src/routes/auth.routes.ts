import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { verifyCsrf } from '../middleware/csrf.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginSchema } from '../validators/auth.validator.js';

export const authRouter = Router();

// CSRF token retrieval
authRouter.get('/csrf-token', (req, res, next) => authController.getCsrfToken(req, res, next));

// Login (public, validated)
authRouter.post('/login', validateBody(loginSchema), verifyCsrf, (req, res, next) => authController.login(req, res, next));

// Logout (authenticated session revocation)
authRouter.post('/logout', authenticate, verifyCsrf, (req, res, next) => authController.logout(req, res, next));

// Current user profile
authRouter.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));
