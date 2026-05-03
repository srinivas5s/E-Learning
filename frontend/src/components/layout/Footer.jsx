import { Link } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// ── Links config ──────────────────────────────────────────────────────────────
const FOOTER_LINKS = {
  Platform: [
    { label: "Browse Courses", to: "/courses"  },
    { label: "Become Instructor", to: "/register" },
    { label: "Pricing",        to: "/pricing"  },
    { label: "Enterprise",     to: "/enterprise" },
  ],
  Learn: [
    { label: "Web Development",  to: "/courses" },
    { label: "Data Science",     to: "/courses" },
    { label: "UI/UX Design",     to: "/courses" },
    { label: "Mobile Dev",       to: "/courses" },
  ],
  Company: [
    { label: "About Us",    to: "/about"   },
    { label: "Blog",        to: "/blog"    },
    { label: "Careers",     to: "/careers" },
    { label: "Contact",     to: "/contact" },
  ],
  Support: [
    { label: "Help Center",      to: "/help"    },
    { label: "Privacy Policy",   to: "/privacy" },
    { label: "Terms of Service", to: "/terms"   },
    { label: "Cookie Policy",    to: "/cookies" },
  ],
};

const SOCIAL_LINKS = [
  { icon: <TwitterIcon />,  href: "#", label: "Twitter"  },
  { icon: <GithubIcon />,   href: "#", label: "GitHub"   },
  { icon: <LinkedinIcon />, href: "#", label: "LinkedIn" },
  { icon: <YoutubeIcon />,  href: "#", label: "YouTube"  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full mt-auto"
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderTop:       "1px solid var(--color-border)",
      }}
    >
      {/* ── Main Footer ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand column — spans 2 cols on lg */}
          <div className="lg:col-span-2 space-y-4">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center
                              text-white text-sm font-bold"
                   style={{ backgroundColor: "var(--color-primary)" }}>
                L
              </div>
              <span className="font-bold text-lg"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
                LearnFlow
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm leading-relaxed max-w-xs"
               style={{ color: "var(--color-text-muted)" }}>
              Empowering learners worldwide with high-quality courses taught by
              industry experts.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center
                             transition-all duration-150 hover:scale-105"
                  style={{
                    color:           "var(--color-text-muted)",
                    backgroundColor: "transparent",
                    border:          "1px solid var(--color-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.1)";
                    e.currentTarget.style.color           = "var(--color-primary)";
                    e.currentTarget.style.borderColor     = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color           = "var(--color-text-muted)";
                    e.currentTarget.style.borderColor     = "var(--color-border)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold mb-4"
                  style={{ color: "var(--color-text-heading)" }}>
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors duration-150"
                      style={{ color: "var(--color-text-muted)" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter strip ─────────────────────────────────────────────── */}
        <div
          className="mt-10 rounded-xl px-6 py-5 flex flex-col sm:flex-row
                     items-start sm:items-center justify-between gap-4"
          style={{
            backgroundColor: "rgba(99,102,241,0.07)",
            border:          "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              Stay in the loop
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Get new courses and learning tips delivered to your inbox.
            </p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-field w-full sm:w-56 py-2 text-sm"
            />
            <button className="btn-primary px-4 py-2 whitespace-nowrap text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────────────────── */}
      <div
        className="px-4 sm:px-6 py-4"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center
                        justify-between gap-2 text-xs"
             style={{ color: "var(--color-text-muted)" }}>
          <p>© {year} LearnFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="transition-colors duration-150 hover:underline"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;