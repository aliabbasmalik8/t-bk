import argon2 from 'argon2';

const encrypt = async (password) => argon2.hash(password);

const verify = async (encrypted, nonEncrypted) => {
  if (await argon2.verify(encrypted, nonEncrypted)) {
    return true;
  }
  return false;
};

module.exports = {
  encrypt,
  verify,
};
