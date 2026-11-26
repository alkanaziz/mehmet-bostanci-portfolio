"use client";

import { useEffect, useState } from "react";

// Both sites post to bostanci-art.de, so all mail leaves from one server (SPF).
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "https://bostanci-art.de/api/kontakt.php";

const MESSAGES = {
  ok: "Vielen Dank! Ihre Nachricht wurde gesendet. Ich melde mich so bald wie möglich.",
  invalid: "Bitte prüfen Sie Ihre Eingaben: Name, eine gültige E-Mail-Adresse und eine Nachricht sind erforderlich.",
  rate: "Es wurden zu viele Nachrichten gesendet. Bitte versuchen Sie es später noch einmal.",
  error: "Die Nachricht konnte leider nicht gesendet werden.",
};

const inputClass =
  "w-full rounded-md border border-gray-300 p-2 focus:border-black focus:ring-1 focus:ring-black focus:outline-hidden";
const labelClass = "mb-2 block text-sm font-medium text-gray-700";

/**
 * email: fallback address shown when sending fails.
 * privacyHref: link to the privacy page, if one exists in the CMS.
 */
export default function ContactForm({ email, privacyHref }) {
  const [status, setStatus] = useState("idle"); // idle | sending | ok | invalid | rate | error
  const [started, setStarted] = useState("");

  useEffect(() => {
    setStarted(String(Date.now()));
    // Without JavaScript the server redirects back with ?status=...
    const fromServer = new URLSearchParams(window.location.search).get("status");
    if (fromServer && MESSAGES[fromServer]) setStatus(fromServer);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
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
      <form action={ENDPOINT} method="post" onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-center font-serif text-xl font-semibold">Kontaktformular</h2>

        {/* Spam traps: hidden field for bots, and the time the form was opened */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="started" value={started} />

        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input type="text" id="name" name="name" required maxLength={100} autoComplete="name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-Mail
          </label>
          <input type="email" id="email" name="email" required maxLength={200} autoComplete="email" className={inputClass} />
        </div>

        <div>
          <label htmlFor="subject" className={labelClass}>
            Betreff <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <input type="text" id="subject" name="subject" maxLength={150} className={inputClass} />
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            Nachricht
          </label>
          <textarea id="message" name="message" rows={5} required maxLength={5000} className={inputClass} />
        </div>

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
