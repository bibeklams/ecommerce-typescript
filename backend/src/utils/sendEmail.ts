import transporter from "../config/mailer.js";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `ShopVerse <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.response);

    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

export default sendEmail;
