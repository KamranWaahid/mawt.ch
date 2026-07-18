import "server-only";
import nodemailer from "nodemailer";
import { logger } from "./logger";
import { sanitizeHeaderValue } from "./text-sanitize";

/**
 * Lead emails, sent through the existing info@mawt.ch mailbox over SMTP
 * (nodemailer). No third-party email account is needed: SPF/DKIM are already
 * handled by the mail host of the mailbox itself.
 *
 * Env vars:
 *   SMTP_HOST  e.g. smtp.hostinger.com or mail.infomaniak.com
 *   SMTP_PORT  465 (SSL, default) or 587 (STARTTLS)
 *   SMTP_USER  the mailbox, e.g. info@mawt.ch
 *   SMTP_PASS  the mailbox password
 *   CONTACT_NOTIFY_TO    override notification recipient (default info@mawt.ch)
 *   CONTACT_NOTIFY_FROM  override From display (default "MAWT <SMTP_USER>")
 *
 * If SMTP is not configured but RESEND_API_KEY is set, Resend is used as a
 * fallback. An email failure never breaks the form submission — the lead is
 * already persisted in Sanity before any email is attempted.
 */

export type Lead = {
  name: string;
  email: string;
  service?: string;
  timeline?: string;
  message: string;
};

function getSmtpTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function defaultFrom() {
  return (
    process.env.CONTACT_NOTIFY_FROM ||
    `MAWT <${process.env.SMTP_USER || "info@mawt.ch"}>`
  );
}

async function deliver(mail: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const transport = getSmtpTransport();
  if (transport) {
    await transport.sendMail({ from: defaultFrom(), ...mail });
    return true;
  }

  // Fallback: Resend REST API (only if configured).
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: defaultFrom(),
        to: [mail.to],
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
        subject: mail.subject,
        text: mail.text,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    return true;
  }

  logger.warn(
    "No SMTP_* vars and no RESEND_API_KEY — lead stored in Sanity but no email sent",
  );
  return false;
}

/** Internal notification: a new lead landed. */
export async function sendLeadNotification(lead: Lead) {
  const to = process.env.CONTACT_NOTIFY_TO || "info@mawt.ch";
  try {
    await deliver({
      to,
      replyTo: lead.email,
      // User-controlled values interpolated into a header MUST be sanitized:
      // a name containing \r\n could inject extra headers (Bcc, etc.).
      subject: sanitizeHeaderValue(
        `Nouveau lead : ${lead.name}${lead.service ? ` (${lead.service})` : ""}`,
      ),
      text: [
        `Nom : ${lead.name}`,
        `Email : ${lead.email}`,
        lead.service ? `Service : ${lead.service}` : null,
        lead.timeline ? `Délai : ${lead.timeline}` : null,
        "",
        lead.message,
        "",
        "Formulaire de contact mawt.ch (lead aussi enregistré dans Sanity)",
      ]
        .filter((l): l is string => l !== null)
        .join("\n"),
    });
  } catch (err) {
    logger.error("Lead notification email failed", err);
  }
}

/** Confirmation ("thank you") email to the person who submitted the form. */
export async function sendLeadThankYou(lead: Lead, lang: "en" | "fr") {
  const firstName = lead.name.trim().split(/\s+/)[0] || lead.name;
  const subject =
    lang === "fr"
      ? "Nous avons bien reçu votre message"
      : "We received your message";
  const text =
    lang === "fr"
      ? [
          `Bonjour ${firstName},`,
          "",
          "Merci pour votre message, il est bien arrivé.",
          "Nous revenons vers vous sous un jour ouvré pour en discuter concrètement.",
          "",
          "En attendant, vous pouvez répondre directement à cet email si vous souhaitez ajouter un détail ou une pièce jointe.",
          "",
          "À très vite,",
          "L'équipe MAWT",
          "",
          "MAWT, agence IA à Genève",
          "Rue de la Fontenette 23, 1227 Carouge",
          "+41 76 636 33 33 · mawt.ch",
        ].join("\n")
      : [
          `Hello ${firstName},`,
          "",
          "Thanks for your message, it reached us.",
          "We will get back to you within one business day to discuss the details.",
          "",
          "In the meantime, feel free to reply directly to this email if you want to add anything.",
          "",
          "Talk soon,",
          "The MAWT team",
          "",
          "MAWT, AI agency in Geneva",
          "Rue de la Fontenette 23, 1227 Carouge",
          "+41 76 636 33 33 · mawt.ch",
        ].join("\n");

  try {
    await deliver({
      to: lead.email,
      replyTo: process.env.CONTACT_NOTIFY_TO || "info@mawt.ch",
      subject,
      text,
    });
  } catch (err) {
    // Never surface to the visitor; the lead is stored and the team notified.
    logger.error("Lead thank-you email failed", err);
  }
}
