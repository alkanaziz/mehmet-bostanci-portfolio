"use client";

import { useCallback, useEffect, useState } from "react";
import { CONTACT_FIELDS, maxLengthOf, validateContact, validateField } from "@/lib/contactValidation";

// Both sites post to bostanci-art.de, so all mail leaves from one server (SPF).
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "https://bostanci-art.de/api/kontakt.php";

const MESSAGES = {
  ok: "Vielen Dank! Ihre Nachricht wurde gesendet. Ich melde mich so bald wie möglich.",
  invalid: "Bitte prüfen Sie Ihre Eingaben: Name, eine gültige E-Mail-Adresse und eine Nachricht sind erforderlich.",
  rate: "Es wurden zu viele Nachrichten gesendet. Bitte versuchen Sie es später noch einmal.",
  error: "Die Nachricht konnte leider nicht gesendet werden.",
};

const inputBase = "w-full rounded-md border p-2 focus:ring-1 focus:outline-hidden";
const inputValid = "border-gray-300 focus:border-black focus:ring-black";
const inputInvalid = "border-red-600 bg-red-50/40 focus:border-red-700 focus:ring-red-700";
const labelClass = "mb-2 block text-sm font-medium text-gray-700";

/** Label, input (or textarea) and the field's error message. */
function FormField({ id, label, error, multiline = false, ...inputProps }) {
  const errorId = `${id}-error`;
  const Control = multiline ? "textarea" : "input";
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Control
        id={id}
        name={id}
        maxLength={maxLengthOf(id)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputBase} ${error ? inputInvalid : inputValid}`}
        {...inputProps}
      />
      {/* Always rendered, so screen readers announce a message when it appears */}
      <p id={errorId} aria-live="polite" className="mt-1 text-sm text-red-700 empty:hidden">
        {error}
      </p>
    </div>
  );
}

/**
 * email: fallback address shown when sending fails.
 * privacyHref: link to the privacy page, if one exists in the CMS.
 *
 * Validation strategy: all fields on submit (first invalid one gets the focus);
 * a single field when it is left with content (no "required" message just for
 * tabbing through); a field that shows an error is re-checked while typing, so
 * the message disappears as soon as the input is valid.
 */
export default function ContactForm({ email, privacyHref }) {
  const [status, setStatus] = useState("idle"); // idle | sending | ok | invalid | rate | error
  const [started, setStarted] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setStarted(String(Date.now()));
    // Without JavaScript the server redirects back with ?status=...
    const fromServer = new URLSearchParams(window.location.search).get("status");
    if (fromServer && MESSAGES[fromServer]) setStatus(fromServer);
  }, []);

  // Only updates state when the message of that field actually changes.
  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => {
      if ((prev[field] ?? "") === message) return prev;
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }, []);

  function handleBlur(event) {
    const { name, value } = event.target;
    if (!CONTACT_FIELDS.includes(name)) return;
    if (value.trim() || errors[name]) setFieldError(name, validateField(name, value));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (errors[name]) setFieldError(name, validateField(name, value));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    const values = Object.fromEntries(CONTACT_FIELDS.map((field) => [field, form.elements[field].value]));
    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = CONTACT_FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      setStatus("idle");
      form.elements[firstInvalid].focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams(new FormData(form)),
      });
      const data = await res.json().catch(() => ({}));
      const code = MESSAGES[data.code] ? data.code : "error";
      setStatus(code);
      if (code === "ok") form.reset();
    } catch {
      setStatus("error");
    }
  }

  const done = status === "ok";

  return (
    <div id="kontaktformular" className="rounded-lg bg-white p-4 shadow-lg">
      {/* noValidate only once JavaScript runs: without it the browser's own checks still apply */}
      <form
        action={ENDPOINT}
        method="post"
        noValidate={started !== ""}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        onChange={handleChange}
        className="space-y-6"
      >
        <h2 className="text-center font-serif text-xl font-semibold">Kontaktformular</h2>

        {/* Spam traps: hidden field for bots, and the time the form was opened */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="started" value={started} />

        <FormField id="name" label="Name" type="text" required autoComplete="name" error={errors.name} />
        <FormField id="email" label="E-Mail" type="email" required autoComplete="email" error={errors.email} />
        <FormField
          id="subject"
          label={
            <>
              Betreff <span className="font-normal text-gray-500">(optional)</span>
            </>
          }
          type="text"
          error={errors.subject}
        />
        <FormField id="message" label="Nachricht" multiline rows={5} required error={errors.message} />

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-hidden disabled:opacity-60"
        >
          {status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
        </button>

        <div role="status" aria-live="polite">
          {MESSAGES[status] && (
            <p className={`rounded-md p-3 text-sm ${done ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {MESSAGES[status]}
              {status === "error" && email && (
                <>
                  {" "}
                  Bitte schreiben Sie direkt an{" "}
                  <a className="underline" href={`mailto:${email}`}>
                    {email}
                  </a>
                  .
                </>
              )}
            </p>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Ihre Angaben werden ausschließlich zur Beantwortung Ihrer Anfrage per E-Mail übermittelt und nicht auf
          dieser Website gespeichert.
          {privacyHref && (
            <>
              {" "}
              Weitere Informationen finden Sie in der{" "}
              <a className="underline" href={privacyHref}>
                Datenschutzerklärung
              </a>
              .
            </>
          )}
        </p>
      </form>
    </div>
  );
}
