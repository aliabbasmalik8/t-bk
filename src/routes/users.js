import express from 'express';
import { authMiddleware } from 'middlewares';
import userController from '../controllers/users';
import { catchErrors } from '../handler/errorHandlers';

const router = express.Router();

router.get(
  '/',
  authMiddleware.isAuthTokenRevoked,
  authMiddleware.authenticateToken(),
  catchErrors(userController.show),
);
router.post('/signup', catchErrors(userController.signup));
router.post('/signin', catchErrors(userController.signin));
router.put('/change-password', catchErrors(userController.changePassword));
router.post('/forgot-password', catchErrors(userController.forgotPassword));
router.put('/reset-password', authMiddleware.verifyResetPasswordToken, catchErrors(userController.resetPassword));

module.exports = router;
