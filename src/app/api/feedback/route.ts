// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";

// const SMTP_HOST = process.env.SMTP_HOST;
// const SMTP_PORT = process.env.SMTP_PORT || "465";
// const SMTP_USER = process.env.SMTP_USER;
// const SMTP_PASS = process.env.SMTP_PASS;
// const EMAIL_TO = process.env.EMAIL_TO;
// const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER;

// export async function POST(req: Request) {
//   const data = await req.json();
//   const { rating, category, name, email, message, logPaste } = data;

//   if (!message || !message.trim()) {
//     return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
//   }

//   if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
//     return NextResponse.json(
//       { error: "Email submission is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_TO." },
//       { status: 500 }
//     );
//   }

//   const transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: Number(SMTP_PORT),
//     secure: Number(SMTP_PORT) === 465,
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },
//   });

//   const subject = `NextBit Probe Feedback${category ? ` – ${category}` : ""}`;
//   const plainText = [
//     `Name: ${name || "Anonymous"}`,
//     `Email: ${email || "Not provided"}`,
//     `Rating: ${rating > 0 ? `${rating}/5` : "No rating"}`,
//     `Category: ${category || "Not specified"}`,
//     "",
//     "Message:",
//     message,
//     logPaste ? "\nLog paste:\n" + logPaste : "",
//   ].join("\n");

//   const html = `
//     <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#edf2f7;">
//       <p><strong>Name:</strong> ${name || "Anonymous"}</p>
//       <p><strong>Email:</strong> ${email || "Not provided"}</p>
//       <p><strong>Rating:</strong> ${rating > 0 ? `${rating}/5` : "No rating"}</p>
//       <p><strong>Category:</strong> ${category || "Not specified"}</p>
//       <h3>Message</h3>
//       <p style="white-space:pre-wrap;">${message}</p>
//       ${logPaste ? `<h3>Log Paste</h3><pre style="white-space:pre-wrap; background:#111827; color:#d1d5db; padding:12px; border-radius:8px;">${logPaste}</pre>` : ""}
//     </div>
//   `;

//   try {
//     await transporter.sendMail({
//       from: EMAIL_FROM,
//       to: EMAIL_TO,
//       subject,
//       text: plainText,
//       html,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "Failed to send feedback.";
//     return NextResponse.json(
//       { error: errorMessage },
//       { status: 500 }
//     );
//   }
// }


// /////////////////////////////////////////////////////////////////////////
// The above code is the original implementation using nodemailer and SMTP.
// The below code is the new implementation using Resend's email API.
// Make sure to set RESEND_API_KEY in your environment variables for the new implementation to work.
// If you want to switch back to the original SMTP implementation, simply replace the code in this file with the above code and ensure your SMTP environment variables are set correctly.
////////////////////////////////////////////////////////////////////////////////////////////////

import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_TO = process.env.EMAIL_TO!;
const EMAIL_FROM = "NextBit Probe <onboarding@resend.dev>";

export async function POST(req: Request) {
  const data = await req.json();
  const { rating, category, name, email, message, logPaste } = data;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !EMAIL_TO) {
    return NextResponse.json({ error: "Email submission is not configured." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const stars = rating > 0 ? "★".repeat(rating) + "☆".repeat(5 - rating) : null;
  const subject = `NextBit Probe Feedback${category ? ` – ${category}` : ""}`;

  // ── Email you receive ──────────────────────────────────────────────
  const adminHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0055FF,#00F2FF);padding:28px 32px;">
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7);">Hardware · OS · Firmware Forensics</p>
        <h1 style="margin:0 0 6px;font-size:20px;color:#fff;letter-spacing:-0.3px;">📋 New Feedback Received</h1>
        <p style="margin:0 0 16px;font-size:13px;color:rgba(255,255,255,0.85);">NextBit Probe · ${new Date().toUTCString()}</p>
        <div style="border-top:1px solid rgba(255,255,255,0.2);padding-top:14px;">
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.95);font-style:italic;line-height:1.6;">
            "Every machine has a story. NextBit Probe narrates the unseen."
          </p>
          <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.6);line-height:1.5;">
            High-fidelity hardware, OS & firmware forensic audit tool — extracting deep-level telemetry across 64-bit architectures, from silicon to kernel.
          </p>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;">

        <!-- Sender info -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:13px;width:120px;">Name</td>
            <td style="padding:10px 0;border-bottom:1px solid #1e293b;font-size:14px;">${name || "<em style='color:#64748b'>Anonymous</em>"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:13px;">Email</td>
            <td style="padding:10px 0;border-bottom:1px solid #1e293b;font-size:14px;">${email ? `<a href="mailto:${email}" style="color:#00F2FF;text-decoration:none;">${email}</a>` : "<em style='color:#64748b'>Not provided</em>"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:13px;">Category</td>
            <td style="padding:10px 0;border-bottom:1px solid #1e293b;font-size:14px;">${category || "<em style='color:#64748b'>Not specified</em>"}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#94a3b8;font-size:13px;">Rating</td>
            <td style="padding:10px 0;font-size:18px;color:#f59e0b;">${stars || "<em style='color:#64748b;font-size:13px'>No rating</em>"}</td>
          </tr>
        </table>

        <!-- Message -->
        <div style="background:#1e293b;border-left:3px solid #00F2FF;border-radius:6px;padding:16px 20px;margin-bottom:${logPaste ? "24px" : "0"};">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Message</p>
          <p style="margin:0;font-size:14px;white-space:pre-wrap;line-height:1.7;">${message}</p>
        </div>

        <!-- Log paste -->
        ${logPaste ? `
        <div style="margin-top:0;">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Scan Log</p>
          <pre style="background:#020617;color:#7dd3fc;padding:16px;border-radius:6px;font-size:11px;white-space:pre-wrap;overflow-x:auto;margin:0;">${logPaste}</pre>
        </div>` : ""}
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;background:#020617;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#00F2FF;font-style:italic;">"Every machine has a story. NextBit Probe narrates the unseen."</p>
        <p style="margin:0;font-size:11px;color:#334155;">NextBit Probe · XcognVis · Nairobi, Kenya</p>
      </div>
    </div>
  `;

  // ── Auto-reply to user ─────────────────────────────────────────────
  const userHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0055FF,#00F2FF);padding:28px 32px;">
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.7);">Hardware · OS · Firmware Forensics</p>
        <h1 style="margin:0 0 6px;font-size:20px;color:#fff;letter-spacing:-0.3px;">Thanks for your feedback 🙌</h1>
        <p style="margin:0 0 16px;font-size:13px;color:rgba(255,255,255,0.85);">NextBit Probe · ${new Date().toUTCString()}</p>
        <div style="border-top:1px solid rgba(255,255,255,0.2);padding-top:14px;">
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.95);font-style:italic;line-height:1.6;">
            "Every machine has a story. NextBit Probe narrates the unseen."
          </p>
          <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.6);line-height:1.5;">
            High-fidelity hardware, OS & firmware forensic audit tool — extracting deep-level telemetry across 64-bit architectures, from silicon to kernel.
          </p>
        </div>
      </div>

      <div style="padding:28px 32px;">
        <p style="font-size:15px;margin:0 0 16px;">Hi ${name || "there"},</p>
        <p style="font-size:14px;line-height:1.7;color:#cbd5e1;margin:0 0 24px;">
          Your feedback has been received and will be reviewed by the NextBit team. 
          We read every submission — it directly shapes what gets built next.
        </p>

        <!-- Their submission summary -->
        <div style="background:#1e293b;border-radius:8px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Your submission</p>
          ${category ? `<p style="margin:0 0 8px;font-size:13px;"><span style="color:#94a3b8;">Category:</span> ${category}</p>` : ""}
          ${stars ? `<p style="margin:0 0 8px;font-size:13px;"><span style="color:#94a3b8;">Rating:</span> <span style="color:#f59e0b;">${stars}</span></p>` : ""}
          <p style="margin:0;font-size:13px;color:#94a3b8;">Message:</p>
          <p style="margin:6px 0 0;font-size:13px;white-space:pre-wrap;line-height:1.6;color:#cbd5e1;">${message}</p>
        </div>

        <p style="font-size:13px;color:#64748b;margin:0;">
          If you have anything to add, just reply to this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:16px 32px;background:#020617;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;color:#00F2FF;font-style:italic;">"Every machine has a story. NextBit Probe narrates the unseen."</p>
        <p style="margin:0;font-size:11px;color:#334155;">NextBit Probe · XcognVis · Nairobi, Kenya</p>
      </div>
    </div>
  `;

  try {
    // Send both emails in parallel
    const sends = [
      resend.emails.send({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject,
        html: adminHtml,
      }),
    ];

    // Auto-reply only if user provided email
    if (email && email.trim()) {
      sends.push(
        resend.emails.send({
          from: EMAIL_FROM,
          to: email.trim(),
          subject: "We received your feedback – NextBit Probe",
          html: userHtml,
        })
      );
    }

    await Promise.all(sends);
    // const results = await Promise.all(sends);
    // console.log("✅ Resend results:", JSON.stringify(results, null, 2));
    return NextResponse.json({ success: true });

  } catch (error: unknown) {
      // console.error("❌ Resend error:", error);

    const errorMessage = error instanceof Error ? error.message : "Failed to send feedback.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}