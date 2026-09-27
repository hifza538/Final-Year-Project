// backend/utils/sendEmail.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  const { data, error } = await resend.emails.send({
    from: "LocalBites <onboarding@resend.dev>",
    to,
    subject,
    text,
    ...(html && { html }),
  });

  if (error) {
    console.error("EMAIL FAILED:", error);
    throw new Error(error.message || "Failed to send email");
  }

  console.log("EMAIL SENT:", data?.id);
  return data;
};

export const sendEmailSafe = async (options) => {
  try {
    await sendEmail(options);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return false;
  }
};

export default sendEmail;