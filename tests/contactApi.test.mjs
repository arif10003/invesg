import test from "node:test";
import assert from "node:assert/strict";
import { ContactSubmissionError, submitContactInquiry, validateContactPayload } from "../src/utils/contactApi.js";

const valid = { full_name: "Ari", email: "ari@example.com", organization: null, country: null, inquiry_type: "General inquiry", message: "Please contact me.", consent_given: true, source: "contact", context: {}, website: "" };
const jsonResponse = (status, body) => ({ ok: status >= 200 && status < 300, status, headers: { get: () => "application/json" }, json: async () => body });

test("validates required fields and email", () => {
  const errors = validateContactPayload({ ...valid, full_name: "", email: "invalid", inquiry_type: "", message: "", consent_given: false });
  assert.deepEqual(Object.keys(errors).sort(), ["consent_given", "email", "full_name", "inquiry_type", "message"]);
});

test("rejects the spam honeypot before making a request", async () => {
  let requested = false;
  await assert.rejects(() => submitContactInquiry({ ...valid, website: "spam.example" }, { fetchImpl: async () => { requested = true; return jsonResponse(201, {}); } }), (error) => error.code === "validation");
  assert.equal(requested, false);
});

test("accepts only explicit server confirmation", async () => {
  const result = await submitContactInquiry(valid, { apiBaseUrl: "https://api.example", submissionId: "id-1", fetchImpl: async () => jsonResponse(201, { accepted: true, inquiry_id: "inq_123" }) });
  assert.equal(result.inquiry_id, "inq_123");
});

for (const [name, status, code] of [["duplicate", 409, "duplicate"], ["rate limit", 429, "rate_limit"], ["backend failure", 503, "backend"]]) {
  test(`reports ${name}`, async () => {
    await assert.rejects(() => submitContactInquiry(valid, { apiBaseUrl: "https://api.example", fetchImpl: async () => jsonResponse(status, {}) }), (error) => error instanceof ContactSubmissionError && error.code === code);
  });
}

test("does not accept a generic successful response", async () => {
  await assert.rejects(() => submitContactInquiry(valid, { apiBaseUrl: "https://api.example", fetchImpl: async () => jsonResponse(200, { message: "ok" }) }), (error) => error.code === "backend");
});
