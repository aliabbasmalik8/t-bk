import { regexUtils } from 'utils';

const emailValidator = (email) => regexUtils.emailVarification(email);

const passwordValidator = (password) => password !== undefined;

module.exports = {
  emailValidator,
  passwordValidator,
};
