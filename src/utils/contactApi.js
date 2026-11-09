const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContactSubmissionError extends Error {
  constructor(code, message, fieldErrors = {}) {
    super(message);
    this.name = "ContactSubmissionError";
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export function validateContactPayload(payload) {
  const errors = {};
  if (!payload.full_name?.trim()) errors.full_name = "Enter your name.";
  if (!EMAIL_PATTERN.test(payload.email?.trim() || "")) errors.email = "Enter a valid work email address.";
  if (!payload.inquiry_type) errors.inquiry_type = "Select an inquiry type.";
  if (!payload.message?.trim()) errors.message = "Tell us how INVESG can help.";
  else if (payload.message.trim().length > 1500) errors.message = "Keep your message within 1,500 characters.";
  if (payload.consent_given !== true) errors.consent_given = "Consent is required before submitting.";
  if (payload.website) errors.website = "Submission rejected.";
  return errors;
}

export function createSubmissionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function submitContactInquiry(payload, options = {}) {
  const validationErrors = validateContactPayload(payload);
  if (Object.keys(validationErrors).length) {
    throw new ContactSubmissionError("validation", "Please review the highlighted fields.", validationErrors);
  }

  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (!fetchImpl) throw new ContactSubmissionError("configuration", "Contact delivery is not configured.");
  const apiBaseUrl = (options.apiBaseUrl ?? import.meta.env?.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 12000);

  try {
    const response = await fetchImpl(`${apiBaseUrl}/api/v1/contact-inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Idempotency-Key": options.submissionId || createSubmissionId(),
      },
      credentials: "omit",
      signal: controller.signal,
      body: JSON.stringify(payload),
    });
    const contentType = response.headers?.get?.("content-type") || "";
    const result = contentType.includes("application/json") ? await response.json() : null;

    if (response.ok && result?.accepted === true && typeof result.inquiry_id === "string") return result;
    if (response.status === 422) throw new ContactSubmissionError("validation", result?.message || "Please review the submitted information.", result?.errors || {});
    if (response.status === 409) throw new ContactSubmissionError("duplicate", "This inquiry appears to have already been received. Please wait before submitting it again.");
    if (response.status === 429) throw new ContactSubmissionError("rate_limit", "Too many attempts were received. Please wait a few minutes and try again.");
    throw new ContactSubmissionError("backend", "We could not confirm delivery. Please try again or email hello@invesg.co.");
  } catch (error) {
    if (error instanceof ContactSubmissionError) throw error;
    if (error?.name === "AbortError") throw new ContactSubmissionError("timeout", "The request timed out and delivery was not confirmed. Please try again.");
    throw new ContactSubmissionError("network", "We could not reach the inquiry service. Please try again or email hello@invesg.co.");
  } finally {
    clearTimeout(timeout);
  }
}
