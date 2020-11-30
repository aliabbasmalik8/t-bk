import mongoose from 'mongoose';
import { hashingUtils } from 'utils';
import { userValidator } from 'dbValidators';
import { authMiddleware } from 'middlewares';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: userValidator.emailValidator,
      message: (props) => `${props.value} is not valid email.`,
    },
  },
  password: {
    type: String,
    required: true,
    min: [8, 'password must be at least 8 characters'],
    validate: {
      validator: userValidator.passwordValidator,
      message: () => 'Not Valid password',
    },
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
});

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

userSchema.statics.createUser = async function (email,name, password) {
  const hashPassword = await hashingUtils.encrypt(password);
  return this.create({
    email,
    name,
    password: hashPassword,
  });
};


userSchema.methods.setForgotPasswordToken = async function () {
  this.resetPasswordToken = authMiddleware.generateTokenWithExpiry(this.email, '4h');
  return this.save();
};

userSchema.methods.resetForgotPasswordToken = async function () {
  this.resetPasswordToken = null;
  return this.save();
};

userSchema.pre('updateOne', async function (next) {
  if (this._update.password) {
    this._update.password = await hashingUtils.encrypt(this._update.password);
  }
  next();
});


module.exports = mongoose.model('User', userSchema);
