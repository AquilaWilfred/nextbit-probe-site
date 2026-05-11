import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || "465";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER;

export async function POST(req: Request) {
  const data = await req.json();
  const { rating, category, name, email, message, logPaste } = data;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_TO) {
    return NextResponse.json(
      { error: "Email submission is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_TO." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const subject = `NextBit Probe Feedback${category ? ` – ${category}` : ""}`;
  const plainText = [
    `Name: ${name || "Anonymous"}`,
    `Email: ${email || "Not provided"}`,
    `Rating: ${rating > 0 ? `${rating}/5` : "No rating"}`,
    `Category: ${category || "Not specified"}`,
    "",
    "Message:",
    message,
    logPaste ? "\nLog paste:\n" + logPaste : "",
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#edf2f7;">
      <p><strong>Name:</strong> ${name || "Anonymous"}</p>
      <p><strong>Email:</strong> ${email || "Not provided"}</p>
      <p><strong>Rating:</strong> ${rating > 0 ? `${rating}/5` : "No rating"}</p>
      <p><strong>Category:</strong> ${category || "Not specified"}</p>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;">${message}</p>
      ${logPaste ? `<h3>Log Paste</h3><pre style="white-space:pre-wrap; background:#111827; color:#d1d5db; padding:12px; border-radius:8px;">${logPaste}</pre>` : ""}
    </div>
  `;

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      text: plainText,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send feedback.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
