import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// ── DATA ──────────────────────────────────────────────────────────────────────

const CONTACT_INFO = [
  {
    emoji:   "✉️",
    title:   "Email Us",
    value:   "hello@learnflow.com",
    sub:     "We reply within 24 hours",
    color:   "#6366f1",
    bg:      "rgba(99,102,241,0.08)",
    border:  "rgba(99,102,241,0.2)",
    href:    "mailto:hello@learnflow.com",
  },
  {
    emoji:   "📞",
    title:   "Call Us",
    value:   "+91 98765 43210",
    sub:     "Mon–Fri, 9am – 6pm IST",
    color:   "#0ea5e9",
    bg:      "rgba(14,165,233,0.08)",
    border:  "rgba(14,165,233,0.2)",
    href:    "tel:+919876543210",
  },
  {
    emoji:   "📍",
    title:   "Visit Us",
    value:   "Bangalore, India",
    sub:     "91 Springboard, Koramangala",
    color:   "#10b981",
    bg:      "rgba(16,185,129,0.08)",
    border:  "rgba(16,185,129,0.2)",
    href:    "https://maps.google.com",
  },
];

const FAQS = [
  {
    q: "How do I enroll in a course?",
    a: "Simply browse our course catalog, click on any course, and hit 'Enroll Now'. If it's a paid course, you'll be taken to our secure checkout.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes — we offer a full 30-day money-back guarantee on all paid courses, no questions asked.",
  },
  {
    q: "Can I access courses on mobile?",
    a: "Absolutely. LearnFlow is fully responsive and works seamlessly on all devices — phone, tablet, and desktop.",
  },
  {
    q: "How do I become an instructor?",
    a: "Click 'Become Instructor' on our register page, fill out your profile, and our team will review your application within 3 business days.",
  },
];

// ── SECTION LABEL ─────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <p className="text-sm font-semibold uppercase tracking-widest mb-3"
     style={{ color: "var(--color-primary)" }}>
    {text}
  </p>
);

// ── HERO ──────────────────────────────────────────────────────────────────────
const ContactHero = () => (
  <section
    className="relative overflow-hidden py-20 sm:py-28"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    {/* Blobs */}
    <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl
                    opacity-20 pointer-events-none"
         style={{ backgroundColor: "var(--color-primary)" }} />
    <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl
                    opacity-10 pointer-events-none"
         style={{ backgroundColor: "#0ea5e9" }} />

    {/* Dot grid */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
         style={{
           backgroundImage: "radial-gradient(circle, var(--color-text) 1px, transparent 1px)",
           backgroundSize:  "32px 32px",
         }} />

    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
      {/* Pill */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                   text-xs font-semibold mb-6"
        style={{
          backgroundColor: "rgba(99,102,241,0.12)",
          color:           "var(--color-primary)",
          border:          "1px solid rgba(99,102,241,0.25)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--color-primary)" }} />
        We'd Love to Hear from You
      </div>

      <h1
        className="text-4xl sm:text-6xl font-bold mb-5 leading-tight"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
      >
        Get in{" "}
        <span style={{ color: "var(--color-primary)" }}>Touch</span>
      </h1>

      <p
        className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
        style={{ color: "var(--color-text-muted)" }}
      >
        Have a question, feedback, or just want to say hello? We're here.
        Our team typically responds within one business day.
      </p>
    </div>
  </section>
);

// ── CONTACT INFO CARDS ────────────────────────────────────────────────────────
const ContactInfo = () => (
  <section className="pb-8" style={{ backgroundColor: "var(--color-bg)" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CONTACT_INFO.map(({ emoji, title, value, sub, color, bg, border, href }) => (
          <a
            key={title}
            href={href}
            target={href.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 group"
            style={{
              backgroundColor: bg,
              border:          `1px solid ${border}`,
              textDecoration:  "none",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl
                         shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${border}` }}
            >
              {emoji}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                 style={{ color }}>
                {title}
              </p>
              <p className="text-sm font-semibold mb-0.5"
                 style={{ color: "var(--color-text-heading)" }}>
                {value}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {sub}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

// ── CONTACT FORM ──────────────────────────────────────────────────────────────
const ContactForm = () => {
  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const successRef                = useRef(null);

  useEffect(() => {
    if (submitted) successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [submitted]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                      e.name    = "Name is required";
    if (!form.email.trim())                     e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email   = "Enter a valid email";
    if (!form.subject.trim())                   e.subject = "Subject is required";
    if (!form.message.trim())                   e.message = "Message is required";
    else if (form.message.trim().length < 20)   e.message = "Message must be at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  // ── Success state ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        ref={successRef}
        className="flex flex-col items-center justify-center text-center
                   py-14 px-8 rounded-2xl h-full"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border:          "1px solid var(--color-border)",
        }}
      >
        {/* Animated checkmark */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6"
          style={{
            backgroundColor: "rgba(16,185,129,0.1)",
            border:          "2px solid rgba(16,185,129,0.3)",
          }}
        >
          ✅
        </div>

        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
        >
          Message Sent!
        </h3>
        <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
          Thanks for reaching out,{" "}
          <span className="font-semibold" style={{ color: "var(--color-text)" }}>
            {form.name}
          </span>
          .
        </p>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          We've received your message and will reply to{" "}
          <span className="font-medium" style={{ color: "var(--color-primary)" }}>
            {form.email}
          </span>{" "}
          within 24 hours.
        </p>

        <button
          onClick={handleReset}
          className="btn-primary px-6 py-2.5 text-sm rounded-xl"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="p-7 sm:p-8 rounded-2xl"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border:          "1px solid var(--color-border)",
      }}
    >
      <h3
        className="text-xl font-bold mb-1"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
      >
        Send a Message
      </h3>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
        Fill in the form and we'll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>

        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              className="input-field" placeholder="John Doe"
              value={form.name} onChange={handleChange}
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>
          <div>
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email"
              className="input-field" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="form-label" htmlFor="subject">Subject</label>
          <select
            id="subject" name="subject"
            className="input-field"
            value={form.subject} onChange={handleChange}
            style={{ cursor: "pointer" }}
          >
            <option value="" disabled>Select a topic...</option>
            <option value="General Enquiry">General Enquiry</option>
            <option value="Course Support">Course Support</option>
            <option value="Billing & Payments">Billing & Payments</option>
            <option value="Become an Instructor">Become an Instructor</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Partnership">Partnership</option>
            <option value="Other">Other</option>
          </select>
          {errors.subject && <p className="error-msg">{errors.subject}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="form-label" htmlFor="message">
            Message
            <span className="ml-2 text-xs font-normal"
                  style={{ color: "var(--color-text-muted)" }}>
              ({form.message.length} / 500)
            </span>
          </label>
          <textarea
            id="message" name="message"
            rows={5}
            maxLength={500}
            className="input-field resize-none"
            placeholder="Tell us how we can help you..."
            value={form.message} onChange={handleChange}
          />
          {errors.message && <p className="error-msg">{errors.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-sm rounded-xl font-semibold"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white
                               rounded-full animate-spin" />
              Sending…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Send Message
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

// ── FAQ ACCORDION ─────────────────────────────────────────────────────────────
const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <div
      className="p-7 sm:p-8 rounded-2xl"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border:          "1px solid var(--color-border)",
      }}
    >
      <h3
        className="text-xl font-bold mb-1"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
      >
        Frequently Asked
      </h3>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
        Quick answers to common questions.
      </p>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
              border:          `1px solid ${open === i ? "rgba(99,102,241,0.3)" : "var(--color-border)"}`,
              backgroundColor: open === i ? "rgba(99,102,241,0.04)" : "transparent",
            }}
          >
            {/* Question */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3.5
                         text-left transition-colors duration-150"
            >
              <span
                className="text-sm font-medium pr-4"
                style={{ color: open === i ? "var(--color-primary)" : "var(--color-text)" }}
              >
                {faq.q}
              </span>
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                           transition-all duration-200 text-xs"
                style={{
                  backgroundColor: open === i ? "var(--color-primary)" : "var(--color-border)",
                  color:           open === i ? "#fff" : "var(--color-text-muted)",
                  transform:       open === i ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>

            {/* Answer */}
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: open === i ? "120px" : "0px" }}
            >
              <p
                className="px-4 pb-4 text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── MAP PLACEHOLDER ───────────────────────────────────────────────────────────
const MapSection = () => (
  <section className="py-16" style={{ backgroundColor: "var(--color-bg)" }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div
        className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden flex
                   items-center justify-center"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border:          "1px solid var(--color-border)",
          background:      "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(14,165,233,0.04) 100%)",
        }}
      >
        {/* Fake map grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Pin */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl
                       shadow-lg animate-bounce"
            style={{
              backgroundColor: "var(--color-primary)",
              animationDuration: "2s",
            }}
          >
            📍
          </div>
          <div
            className="px-5 py-2.5 rounded-xl text-center shadow-md"
            style={{
              backgroundColor: "var(--color-bg-card)",
              border:          "1px solid var(--color-border)",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-heading)" }}>
              LearnFlow HQ
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              91 Springboard, Koramangala, Bangalore
            </p>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </div>
  </section>
);

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
const Contact = () => (
  <div style={{ backgroundColor: "var(--color-bg)" }}>

    <ContactHero />

    <ContactInfo />

    {/* Form + FAQ side by side */}
    <section className="py-12 sm:py-16" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContactForm />
          <FAQ />
        </div>
      </div>
    </section>

    <MapSection />

  </div>
);

export default Contact;