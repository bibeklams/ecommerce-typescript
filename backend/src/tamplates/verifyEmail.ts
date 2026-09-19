export const verifyEmailTemplate = (name: string, otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>

      <p>Welcome to <strong>ShopVerse</strong>.</p>

      <p>Your verification code is:</p>

      <h1>${otp}</h1>

      <p>This code expires in 5 minutes.</p>

      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  `;
};

export const verifyOtpTemplate = (name: string, otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>
      <p>Your ShopVerse verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
};
