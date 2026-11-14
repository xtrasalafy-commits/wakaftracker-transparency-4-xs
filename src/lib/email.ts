import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL ?? "WakafTracker <notifikasi@wakaftracker.id>";

const resend = apiKey ? new Resend(apiKey) : null;

export interface BroadcastRecipient {
  email: string;
  name: string;
}

export interface ProgressBroadcastPayload {
  recipients: BroadcastRecipient[];
  projectTitle: string;
  updateTitle: string;
  updateDescription: string;
  projectUrl: string;
}

/**
 * Sends a progress-update broadcast email to every donor of a project.
 * Integration-ready with Resend: set RESEND_API_KEY in the environment to
 * enable real delivery. Without it, the notification is safely logged so the
 * rest of the product flow (DB record + UI) keeps working in local/dev mode.
 */
export async function sendProgressBroadcast(payload: ProgressBroadcastPayload) {
  const { recipients, projectTitle, updateTitle, updateDescription, projectUrl } = payload;

  if (recipients.length === 0) {
    return { sent: 0, skipped: true };
  }

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#0f766e;">Update Progres: ${projectTitle}</h2>
      <h3 style="margin-bottom:4px;">${updateTitle}</h3>
      <p style="color:#334155; line-height:1.6;">${updateDescription}</p>
      <a href="${projectUrl}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#0f766e;color:#fff;border-radius:8px;text-decoration:none;">
        Lihat Detail Proyek
      </a>
      <p style="margin-top:24px;font-size:12px;color:#94a3b8;">
        Anda menerima email ini karena pernah berwakaf melalui WakafTracker.
      </p>
    </div>
  `;

  if (!resend) {
    console.info(
      `[email:mock] Would broadcast "${updateTitle}" to ${recipients.length} wakif(s) for project "${projectTitle}".`
    );
    return { sent: recipients.length, mocked: true };
  }

  try {
    await Promise.all(
      recipients.map((recipient) =>
        resend.emails.send({
          from: fromAddress,
          to: recipient.email,
          subject: `Update Proyek Wakaf: ${projectTitle}`,
          html,
        })
      )
    );
    return { sent: recipients.length, mocked: false };
  } catch (error) {
    console.error("[email] Failed to send broadcast via Resend", error);
    return { sent: 0, error: true };
  }
}

export async function sendDonationReceiptEmail(params: {
  to: string;
  donorName: string;
  projectTitle: string;
  amount: string;
  certificateCode: string;
  certificateUrl: string;
}) {
  const { to, donorName, projectTitle, amount, certificateCode, certificateUrl } = params;

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#0f766e;">Terima kasih, ${donorName}!</h2>
      <p style="color:#334155; line-height:1.6;">
        Wakaf Anda sebesar <strong>${amount}</strong> untuk proyek <strong>${projectTitle}</strong>
        telah kami terima.
      </p>
      <p style="color:#334155;">Kode sertifikat wakaf Anda: <strong>${certificateCode}</strong></p>
      <a href="${certificateUrl}" style="display:inline-block;margin-top:16px;padding:10px 20px;background:#0f766e;color:#fff;border-radius:8px;text-decoration:none;">
        Unduh e-Sertifikat
      </a>
    </div>
  `;

  if (!resend) {
    console.info(`[email:mock] Would send donation receipt to ${to} (${certificateCode}).`);
    return { mocked: true };
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to,
      subject: "e-Sertifikat Wakaf Anda - WakafTracker",
      html,
    });
    return { mocked: false };
  } catch (error) {
    console.error("[email] Failed to send donation receipt via Resend", error);
    return { error: true };
  }
}
