export const sellerApplicationTemplate = (name: string) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>
      <p>Your seller application has been submitted successfully.</p>
      <p>Your application is currently <strong>pending</strong> admin approval.</p>
      <p>We will notify you once your application has been reviewed.</p>
    </div>
  `;
};

export const sellerApprovedTemplate = (name: string) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>
      <p>Congratulations!</p>
      <p>Your seller application has been <strong>approved</strong>.</p>
      <p>You can now start selling products on ShopVerse.</p>
    </div>
  `;
};

export const sellerRejectedTemplate = (name: string) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>
      <p>Your seller application has been <strong>rejected</strong>.</p>
      <p>You can contact the administrator if you have questions.</p>
    </div>
  `;
};

export const sellerDeactivatedTemplate = (name: string) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Hello ${name},</h2>
      <p>Your seller account has been <strong>deactivated</strong>.</p>
      <p>You are now a regular user on ShopVerse.</p>
    </div>
  `;
};
