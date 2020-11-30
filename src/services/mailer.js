import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    return false;
  }
  return true;
};


const sendForgotPasswordEmail = async (to, callbackUrl) => {
  const options = {
    to,
    subject: 'Password Reset',
    html: `<div>
              <div>Please click on link</div>
              <div>${callbackUrl}</div>
            </div>`,
  };
  const status = await sendEmail(options);
  return status;
};

module.exports = {
  sendEmail,
  sendForgotPasswordEmail,
};
