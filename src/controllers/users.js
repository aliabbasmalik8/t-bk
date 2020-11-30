import User from 'models/user';
import { authMiddleware } from 'middlewares';
import { hashingUtils } from 'utils';
import { mailerService } from 'services';

const show = async (req, res) => res.status(200).json({ user: req.user });

const users = async (req, res) => res.status(200).json({ users: await User.find() });

const signup = async (req, res) => {
  const { email, name, password } = req.body;

  let user = await User.findByEmail(email);

  if (user) {
    return res
      .status(404)
      .json({ errors: 'Email has already been taken' });
  }

  user = await User.createUser(email, name, password);

  return res
    .status(200)
    .json({ user, token: authMiddleware.generateAuthToken(user.id) });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res
      .status(401)
      .json({ errors: 'Invalid email or password.' });
  }

  if (!(await hashingUtils.verify(user.password, password))) {
    return res
      .status(401)
      .json({ errors: 'Invalid email or password.' });
  }

  return res
    .status(200)
    .json({ user, token: authMiddleware.generateAuthToken(user.id) });
};

const changePassword = async (req, res) => {
  const { email, password, newPassword } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res
      .status(401)
      .json({ errors: 'Invalid email or password.' });
  }

  if (!(await hashingUtils.verify(user.password, password))) {
    return res
      .status(401)
      .json({ errors: 'Invalid email or password.' });
  }

  await user.updateOne({ password: newPassword });

  return res.status(200).json({ success: true });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res
      .status(401)
      .json({ errors: 'Invalid email or password.' });
  }

  user.setForgotPasswordToken();

  const callbackUrl = `token=${user.resetPasswordToken}`;

  if (!(await mailerService.sendForgotPasswordEmail(email, callbackUrl))) {
    return res.status(500).json({ errors: 'email not send' });
  }

  return res.status(200).json({ message: 'email sent successfully' });
};

const resetPassword = async (req, res) => {
  const {
    email,
    body: { password, token: resetPasswordToken },
  } = req;

  const user = User.findOne({ email, resetPasswordToken });

  if (!user) {
    return res
      .status(401)
      .json({ errors:'Invalid token.' });
  }

  await user.updateOne({ password, resetPasswordToken: null });

  return res.status(200).json({ message: 'password reset successfully.' });
};

module.exports = {
  signup,
  signin,
  changePassword,
  forgotPassword,
  resetPassword,
  show,
  users,
};
