import sendEmail from "../utils/sendEmail.js";

import {
  verifyEmailTemplate,
  verifyOtpTemplate,
} from "../tamplates/verifyEmail.js";

import {
  sellerApplicationTemplate,
  sellerApprovedTemplate,
  sellerRejectedTemplate,
  sellerDeactivatedTemplate,
} from "../tamplates/sellerEmailTemplate.js";

interface EmailVerify {
  email: string;
  name: string;
  otp: string;
}

interface SellerEmail {
  email: string;
  name: string;
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

export const sendResetPasswordEmail = async ({
  email,
  name,
  otp,
}: EmailVerify) => {
  await sendEmail({
    to: email,
    subject: "Verify your ShopVerse account",
    html: verifyOtpTemplate(name, otp),
  });
};

export const sendSellerApplicationEmail = async ({
  email,
  name,
}: SellerEmail) => {
  await sendEmail({
    to: email,
    subject: "Seller application submitted",
    html: sellerApplicationTemplate(name),
  });
};

export const sendSellerApprovedEmail = async ({ email, name }: SellerEmail) => {
  await sendEmail({
    to: email,
    subject: "Your ShopVerse seller application was approved",
    html: sellerApprovedTemplate(name),
  });
};

export const sendSellerRejectedEmail = async ({ email, name }: SellerEmail) => {
  await sendEmail({
    to: email,
    subject: "Update on your ShopVerse seller application",
    html: sellerRejectedTemplate(name),
  });
};

export const sendSellerDeactivatedEmail = async ({
  email,
  name,
}: SellerEmail) => {
  await sendEmail({
    to: email,
    subject: "Your ShopVerse seller account was deactivated",
    html: sellerDeactivatedTemplate(name),
  });
};
