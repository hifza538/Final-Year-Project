// backend/utils/emailTemplates.js
// Approval / rejection emails for vendors and delivery riders

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const layout = ({ heading, headingColor, bodyHtml, buttonLabel }) => {
  const loginUrl = process.env.CLIENT_URL; // optional, e.g. https://localbites.com/login
  const button =
    buttonLabel && loginUrl
      ? `<p style="text-align:center;margin:28px 0 8px;">
           <a href="${loginUrl}" style="background:#e8590c;color:#ffffff;text-decoration:none;
              padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;">
             ${buttonLabel}
           </a>
         </p>`
      : "";

  return `
  <div style="background:#f5f5f5;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
      <div style="background:#1f1f1f;padding:18px 24px;">
        <span style="color:#e8590c;font-size:20px;font-weight:700;">Local</span><span style="color:#ffffff;font-size:20px;font-weight:700;"> Bites</span>
      </div>
      <div style="padding:28px 24px;color:#333333;font-size:14px;line-height:1.6;">
        <h2 style="margin:0 0 16px;font-size:20px;color:${headingColor};">${heading}</h2>
        ${bodyHtml}
        ${button}
      </div>
      <div style="padding:16px 24px;background:#fafafa;color:#999999;font-size:12px;text-align:center;">
        © LocalBites. This is an automated email, please do not reply.
      </div>
    </div>
  </div>`;
};

// role: "vendor" | "delivery"
export const approvalEmail = ({ name, role, shopName }) => {
  const isVendor = role === "vendor";
  const subject = isVendor
    ? "Your LocalBites restaurant has been approved 🎉"
    : "Your LocalBites rider account has been approved 🎉";

  const message = isVendor
    ? `Great news! Your restaurant <strong>${escapeHtml(shopName)}</strong> has been approved. You can now log in and start receiving orders.`
    : `Great news! Your delivery rider account has been approved. You can now log in and start accepting deliveries.`;

  const text = isVendor
    ? `Hi ${name},\n\nGreat news! Your restaurant "${shopName}" has been approved on LocalBites. You can now log in and start receiving orders.\n\n- Team LocalBites`
    : `Hi ${name},\n\nGreat news! Your delivery rider account has been approved on LocalBites. You can now log in and start accepting deliveries.\n\n- Team LocalBites`;

  const html = layout({
    heading: "Congratulations, you're approved!",
    headingColor: "#16a34a",
    bodyHtml: `<p>Hi ${escapeHtml(name)},</p><p>${message}</p><p>Welcome to the LocalBites family!</p>`,
    buttonLabel: "Log in now",
  });

  return { subject, text, html };
};

// wasApproved = true when an already-approved account is being rejected/deactivated
export const rejectionEmail = ({ name, role, shopName, reason, wasApproved = false }) => {
  const isVendor = role === "vendor";
  const accountLabel = isVendor ? `restaurant account "${shopName}"` : "delivery rider account";
  const accountLabelHtml = isVendor
    ? `restaurant account <strong>${escapeHtml(shopName)}</strong>`
    : "delivery rider account";

  const subject = wasApproved
    ? "Your LocalBites account has been deactivated"
    : isVendor
    ? "Update on your LocalBites restaurant application"
    : "Update on your LocalBites rider application";

  const headline = wasApproved ? "Account deactivated" : "Application not approved";

  const sentence = wasApproved
    ? `your ${accountLabel} has been deactivated by our admin team and you can no longer log in.`
    : isVendor
    ? `your restaurant application for "${shopName}" has been rejected.`
    : "your delivery rider application has been rejected.";

  const sentenceHtml = wasApproved
    ? `your ${accountLabelHtml} has been deactivated by our admin team and you can no longer log in.`
    : isVendor
    ? `your restaurant application for <strong>${escapeHtml(shopName)}</strong> has been rejected.`
    : "your delivery rider application has been rejected.";

  const text = `Hi ${name},\n\nWe're sorry, but ${sentence}\n\nReason: ${reason}\n\nIf you think this is a mistake, please contact our support team.\n\n- Team LocalBites`;

  const html = layout({
    heading: headline,
    headingColor: "#dc2626",
    bodyHtml: `
      <p>Hi ${escapeHtml(name)},</p>
      <p>We're sorry, but ${sentenceHtml}</p>
      <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px 14px;border-radius:6px;margin:16px 0;">
        <strong>Reason:</strong> ${escapeHtml(reason)}
      </div>
      <p>If you think this is a mistake, please contact our support team.</p>`,
  });

  return { subject, text, html };
};

// Warning sent by admin to a vendor whose orders keep getting cancelled
export const warningEmail = ({ name, shopName, stats, note }) => {
  const subject = "Important: your LocalBites order performance";

  const text = `Hi ${name},

We noticed that too many orders for "${shopName}" were cancelled in the last ${stats.periodDays} days:

- Orders received: ${stats.total}
- Not accepted in time: ${stats.timedOut}
- Rejected by you: ${stats.rejectedByVendor}
- Cancellation rate: ${stats.cancellationRate}%
${note ? `\nNote from our team: ${note}\n` : ""}
Please accept orders on time and set your restaurant to "closed" when you cannot take orders. If this continues, your account may be deactivated.

- Team LocalBites`;

  const row = (label, value) =>
    `<tr><td style="padding:6px 0;color:#666;">${label}</td><td style="padding:6px 0;text-align:right;font-weight:600;">${value}</td></tr>`;

  const html = layout({
    heading: "Your order performance needs attention",
    headingColor: "#ea580c",
    bodyHtml: `
      <p>Hi ${escapeHtml(name)},</p>
      <p>We noticed that too many orders for <strong>${escapeHtml(shopName)}</strong> were cancelled in the last ${stats.periodDays} days:</p>
      <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;">
        ${row("Orders received", stats.total)}
        ${row("Not accepted in time", stats.timedOut)}
        ${row("Rejected by you", stats.rejectedByVendor)}
        ${row("Cancellation rate", stats.cancellationRate + "%")}
      </table>
      ${
        note
          ? `<div style="background:#fff7ed;border-left:4px solid #ea580c;padding:12px 14px;border-radius:6px;margin:16px 0;">
               <strong>Note from our team:</strong> ${escapeHtml(note)}
             </div>`
          : ""
      }
      <p>Please accept orders on time and set your restaurant to <strong>closed</strong> when you cannot take orders.</p>
      <p style="color:#dc2626;"><strong>If this continues, your account may be deactivated.</strong></p>`,
  });

  return { subject, text, html };
};