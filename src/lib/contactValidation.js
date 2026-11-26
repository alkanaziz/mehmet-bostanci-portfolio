// Validation rules of the contact form. They mirror public/api/kontakt.php
// (required fields, e-mail format, maximum lengths), which stays the authority:
// the client only checks earlier so visitors get immediate feedback.

/** Field order = order in the form (first invalid field gets the focus). */
export const CONTACT_FIELDS = ["name", "email", "subject", "message"];

const RULES = {
  name: { required: true, maxLength: 100, label: "Ihren Namen" },
  email: { required: true, maxLength: 200, label: "Ihre E-Mail-Adresse", format: "email" },
  subject: { required: false, maxLength: 150 },
  message: { required: true, maxLength: 5000, label: "eine Nachricht" },
};

// Pragmatic check (one @, no spaces, a dot in the domain); the server validates strictly.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Max length per field, for the inputs' maxLength attribute. */
export const maxLengthOf = (field) => RULES[field].maxLength;

/** Error message for one field, or "" if the value is valid. */
export function validateField(field, rawValue = "") {
  const rule = RULES[field];
  const value = String(rawValue).trim();

  if (!value) {
    return rule.required ? `Bitte geben Sie ${rule.label} ein.` : "";
  }
  if (value.length > rule.maxLength) {
    return `Bitte kürzen Sie Ihre Eingabe auf höchstens ${rule.maxLength} Zeichen.`;
  }
  if (rule.format === "email" && !EMAIL_PATTERN.test(value)) {
    return "Bitte geben Sie eine gültige E-Mail-Adresse ein, z. B. name@beispiel.de.";
  }
  return "";
}

/** Errors of all fields: { field: message } containing only invalid fields. */
export function validateContact(values) {
  const errors = {};
  for (const field of CONTACT_FIELDS) {
    const message = validateField(field, values[field]);
    if (message) errors[field] = message;
  }
  return errors;
}
