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
const EMAIL_FROM = process.env.EMAIL_FROM || "feedback@yourdomain.com";

export async function POST(req: Request) {
  const data = await req.json();
  const { rating, category, name, email, message, logPaste } = data;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY || !EMAIL_TO) {
    return NextResponse.json(
      { error: "Email submission is not configured." },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = `NextBit Probe Feedback${category ? ` – ${category}` : ""}`;

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#edf2f7;">
      <p><strong>Name:</strong> ${name || "Anonymous"}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <p><strong>Rating:</strong> ${rating > 0 ? `${rating}/5` : "No rating"}</p>
      <p><strong>Category:</strong> ${category || "Not specified"}</p>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;">${message}</p>
      ${logPaste ? `<h3>Log Paste</h3><pre style="background:#111827;color:#d1d5db;padding:12px;border-radius:8px;white-space:pre-wrap;">${logPaste}</pre>` : ""}
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send feedback.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}