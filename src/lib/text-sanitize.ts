/**
 * Small pure text helpers shared by mail + logging. No server-only imports so
 * they stay unit-testable outside Next.
 */

/**
 * Strip CR/LF (and tabs) from a value interpolated into an email header.
 * A name like "Bob\r\nBcc: victim@x" would otherwise inject extra headers.
 */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

/** Redact an email for logs: keep first char + domain ("j***@mawt.ch"). */
export function redactEmail(email: unknown): string {
  if (typeof email !== "string" || !email.includes("@")) return "[redacted]";
  const [local, domain] = email.split("@");
  return `${local.slice(0, 1)}***@${domain}`;
}
