/* eslint-disable no-useless-escape */
// eslint-disable-next-line security/detect-unsafe-regex
const EMAIL_VARIFICATION = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

const emailVarification = (email) => EMAIL_VARIFICATION.test(email);

module.exports = {
  emailVarification,
};
