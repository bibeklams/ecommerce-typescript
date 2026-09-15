import sendEmail from "../utils/sendEmail.js";
import verifyEmailTemplate from "../tamplates/verifyEmail.js";
interface EmailVerify {
  email: string;
  name: string;
  otp: string;
}

export const sendVerificationEmail = async ({
  email,
  name,
  otp,
}: EmailVerify) => {
  await sendEmail({
    to: email,
    subject: "Verify your ShopVerse account",
    html: verifyEmailTemplate(name, otp),
  });
};
