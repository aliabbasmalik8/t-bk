import passport from 'passport';
import { sign, verify } from 'jsonwebtoken';

const generateAuthToken = (userId) => `bearer ${sign({ userId }, process.env.JWT_SECRET)}`;

const generateToken = (userId) => sign({ userId }, process.env.JWT_SECRET);

const generateTokenWithExpiry = (email, expiresIn) => sign({ email }, process.env.JWT_SECRET, { expiresIn });

const isAuthTokenRevoked = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) return res.status(401).send('Unauthorized');

  next();
};

const authenticateToken = () => passport.authenticate('jwt', { session: false });

const verifyToken = async (token) => verify(token, process.env.JWT_SECRET);

const verifyResetPasswordToken = async (req, res, next) => {
  const { token } = req.body;

  try {
    const jwtPayload = await verifyToken(token);
    req.email = jwtPayload.email;
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ errors: ['Password reset token has expired.'] });
  }
};

module.exports = {
  generateAuthToken,
  generateToken,
  generateTokenWithExpiry,
  isAuthTokenRevoked,
  authenticateToken,
  verifyToken,
  verifyResetPasswordToken,
};
