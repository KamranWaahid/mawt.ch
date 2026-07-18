import { test } from "node:test";
import assert from "node:assert/strict";
import { secureEqual } from "../src/lib/secure-compare";
import { sanitizeHeaderValue, redactEmail } from "../src/lib/text-sanitize";

test("secureEqual: equal strings match", () => {
  assert.equal(secureEqual("s3cret-token", "s3cret-token"), true);
});

test("secureEqual: different strings (same and different lengths) never match", () => {
  assert.equal(secureEqual("s3cret-token", "s3cret-tokem"), false);
  assert.equal(secureEqual("short", "a-much-longer-value"), false);
  assert.equal(secureEqual("", "x"), false);
});

test("sanitizeHeaderValue strips CR/LF injection attempts", () => {
  assert.equal(
    sanitizeHeaderValue("Bob\r\nBcc: victim@example.com"),
    "Bob Bcc: victim@example.com",
  );
  assert.equal(sanitizeHeaderValue("plain name"), "plain name");
  assert.equal(sanitizeHeaderValue("tab\there\n"), "tab here");
});

test("redactEmail keeps first char and domain only", () => {
  assert.equal(redactEmail("jane.doe@mawt.ch"), "j***@mawt.ch");
});

test("redactEmail tolerates non-email input", () => {
  assert.equal(redactEmail(null), "[redacted]");
  assert.equal(redactEmail("not-an-email"), "[redacted]");
  assert.equal(redactEmail(42), "[redacted]");
});

test("secureEqual is stable across repeated calls (no state)", () => {
  for (let i = 0; i < 50; i++) {
    assert.equal(secureEqual("token", "token"), true);
    assert.equal(secureEqual("token", "other"), false);
  }
});
