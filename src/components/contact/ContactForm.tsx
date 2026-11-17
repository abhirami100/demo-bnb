"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "number" | "message", string>>;

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "company", label: "Company", type: "text", autoComplete: "organization", required: false },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "number", label: "Phone", type: "tel", autoComplete: "tel", required: true },
] as const;

function validate(data: FormData): Errors {
  const e: Errors = {};
  if (!String(data.get("name") ?? "").trim()) e.name = "Please enter your name.";
  const email = String(data.get("email") ?? "").trim();
  if (!email) e.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
  const phone = String(data.get("number") ?? "").replace(/[\s()-]/g, "");
  if (!phone) e.number = "Please enter your phone number.";
  else if (!/^\+?\d{7,15}$/.test(phone)) e.number = "Please enter a valid phone number.";
  if (!String(data.get("message") ?? "").trim()) e.message = "Please tell us what you need.";
  return e;
}

/**
 * Posts the same urlencoded fields as the current site (name, company, email, number, message)
 * to the existing PHP mailer, so no backend change is needed.
 */
export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [prefill, setPrefill] = useState("");

  // "Enquire" links from brand / product pages pre-fill the message.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const brand = q.get("brand");
    const product = q.get("product");
    if (product) setPrefill(`Hello, I would like to enquire about: ${product}.`);
    else if (brand) setPrefill(`Hello, I would like to enquire about ${brand} products.`);
  }, []);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      ev.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const body = new URLSearchParams();
      data.forEach((v, k) => body.append(k, String(v)));
      const res = await fetch(SITE.mailEndpoint, {
        method: "POST",
        body: body.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.current?.reset();
      setPrefill("");
    } catch {
      setStatus("error");
    }
  };

  const inputCls = (err?: string) =>
    cn(
      "peer w-full rounded-2xl border bg-card px-5 pt-6 pb-2.5 text-base outline-none transition-colors duration-300 placeholder-transparent focus:border-indigo focus:bg-white",
      err ? "border-marker" : "border-line",
    );
  const labelCls =
    "pointer-events-none absolute top-2 left-5 text-xs text-ink-mute transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo";

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="relative" aria-describedby="form-status">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => {
          const err = errors[f.name as keyof Errors];
          return (
            <div key={f.name} className="relative">
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                placeholder={f.label}
                required={f.required}
                aria-invalid={!!err}
                aria-describedby={err ? `${f.name}-err` : undefined}
                className={inputCls(err)}
              />
              <label htmlFor={f.name} className={labelCls}>
                {f.label}
                {!f.required && <span className="ml-1 opacity-60">(optional)</span>}
              </label>
              {err && (
                <p id={`${f.name}-err`} className="mt-1.5 pl-2 text-sm text-marker">
                  {err}
                </p>
              )}
            </div>
          );
        })}
        <div className="relative sm:col-span-2">
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Message"
            required
            defaultValue={prefill}
            key={prefill}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-err" : undefined}
            className={cn(inputCls(errors.message), "resize-y")}
          />
          <label htmlFor="message" className={labelCls}>
            Message
          </label>
          {errors.message && (
            <p id="message-err" className="mt-1.5 pl-2 text-sm text-marker">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-13 items-center gap-3 rounded-full bg-ink py-2 pr-2.5 pl-7 font-medium text-paper transition-colors duration-500 hover:bg-indigo disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          <span className="grid size-8 place-items-center rounded-full bg-paper/15 transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
        </button>
        <p className="text-sm text-ink-mute">
          Or call <a href={SITE.phone.href} className="font-medium text-ink hover:text-indigo">{SITE.phone.label}</a>
        </p>
      </div>

      <div id="form-status" aria-live="polite" className="mt-4 min-h-6">
        <AnimatePresence mode="wait">
          {status === "sent" && (
            <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-[#e6f6ec] px-5 py-4 text-[#145c32]">
              Thank you — your message has been sent. Our team will get back to you shortly.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-marker/10 px-5 py-4 text-[#9a2a12]">
              Sorry, the message could not be sent. Please email{" "}
              <a className="underline" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>{" "}
              or call {SITE.phone.label}.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
