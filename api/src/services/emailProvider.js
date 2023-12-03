const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alali@graduate.utm.my",
    pass: "",
  },
});

async function sendVerificationEmail(email, verificationLink) {
  const mailOptions = {
    from: "alali@graduate.utm.my",
    to: email,
    subject: "Email Verification for FCMS",
    html: `<p>Hello,</p><p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

module.exports = { sendVerificationEmail };
