import { Link } from "react-router-dom";

// ── DATA ──────────────────────────────────────────────────────────────────────

const STATS = [
    { value: "50K+", label: "Active Students", emoji: "🎓", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    { value: "500+", label: "Expert Courses", emoji: "📚", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)" },
    { value: "200+", label: "Top Instructors", emoji: "🧑‍🏫", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { value: "80+", label: "Countries", emoji: "🌍", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
];

const TEAM = [
    {
        name: "Sarah Mitchell",
        role: "CEO & Co-Founder",
        initials: "SM",
        bg: "#6366f1",
        bio: "Former EdTech lead at Coursera with 12+ years building scalable learning platforms.",
        twitter: "#",
        linkedin: "#",
    },
    {
        name: "James Patel",
        role: "CTO & Co-Founder",
        initials: "JP",
        bg: "#0ea5e9",
        bio: "Ex-Google engineer passionate about making quality education accessible to everyone.",
        twitter: "#",
        linkedin: "#",
    },
    {
        name: "Anika Rao",
        role: "Head of Curriculum",
        initials: "AR",
        bg: "#ec4899",
        bio: "PhD in Education Technology. Designed curriculums used by 100K+ learners worldwide.",
        twitter: "#",
        linkedin: "#",
    },
    {
        name: "Chris Okafor",
        role: "Head of Design",
        initials: "CO",
        bg: "#f59e0b",
        bio: "Award-winning UX designer focused on creating delightful, accessible learning experiences.",
        twitter: "#",
        linkedin: "#",
    },
];

const MISSION_CARDS = [
    {
        emoji: "🎯",
        title: "Our Mission",
        color: "#6366f1",
        bg: "rgba(99,102,241,0.08)",
        border: "rgba(99,102,241,0.2)",
        text: "To make world-class education accessible to every learner, regardless of background, location, or budget. We believe learning is a lifelong journey — and we're here to guide it.",
    },
    {
        emoji: "🔭",
        title: "Our Vision",
        color: "#0ea5e9",
        bg: "rgba(14,165,233,0.08)",
        border: "rgba(14,165,233,0.2)",
        text: "A world where anyone, anywhere can acquire the skills to pursue their dream career. We envision LearnFlow as the bridge between ambition and achievement for the next generation.",
    },
    {
        emoji: "💡",
        title: "Our Values",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.08)",
        border: "rgba(245,158,11,0.2)",
        text: "Quality over quantity. Every course is vetted, every instructor reviewed, every lesson refined. We hold ourselves to the highest standards so our learners can focus on growing.",
    },
];

// ── SOCIAL ICONS ──────────────────────────────────────────────────────────────
const TwitterIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

// ── COMPONENTS ────────────────────────────────────────────────────────────────

const SectionLabel = ({ text }) => (
    <p
        className="text-sm font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--color-primary)" }}
    >
        {text}
    </p>
);

const SectionHeading = ({ children }) => (
    <h2
        className="text-3xl sm:text-4xl font-bold mb-4"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
    >
        {children}
    </h2>
);

// ── HERO ──────────────────────────────────────────────────────────────────────
const AboutHero = () => (
    <section
        className="relative overflow-hidden py-20 sm:py-28"
        style={{ backgroundColor: "var(--color-bg)" }}
    >
        {/* Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: "var(--color-primary)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: "#0ea5e9" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
                backgroundImage: "radial-gradient(circle, var(--color-text) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
            }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            {/* Pill */}
            <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                   text-xs font-semibold mb-6"
                style={{
                    backgroundColor: "rgba(99,102,241,0.12)",
                    color: "var(--color-primary)",
                    border: "1px solid rgba(99,102,241,0.25)",
                }}
            >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--color-primary)" }} />
                Our Story
            </div>

            <h1
                className="text-4xl sm:text-6xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}
            >
                We're on a Mission to{" "}
                <span style={{ color: "var(--color-primary)" }}>Democratize</span>
                {" "}Education
            </h1>

            <p
                className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
                style={{ color: "var(--color-text-muted)" }}
            >
                Founded in 2021, LearnFlow started with a simple belief — that everyone
                deserves access to quality education. Today we serve 50,000+ learners
                across 80 countries with 500+ expert-led courses.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/courses" className="btn-primary px-6 py-3 text-sm rounded-xl"
                    style={{ backgroundColor: "var(--color-primary)" }}>
                    Explore Courses
                </Link>
                <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                     transition-all duration-200"
                    style={{
                        color: "var(--color-text)",
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
                >
                    Get in Touch
                </Link>
            </div>
        </div>
    </section>
);

// ── MISSION / VISION / VALUES ─────────────────────────────────────────────────
const MissionVision = () => (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
                <SectionLabel text="What Drives Us" />
                <SectionHeading>
                    Purpose Behind{" "}
                    <span style={{ color: "var(--color-primary)" }}>LearnFlow</span>
                </SectionHeading>
                <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
                    Everything we build is guided by three core principles that have shaped
                    our platform from day one.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MISSION_CARDS.map((card) => (
                    <div
                        key={card.title}
                        className="p-7 rounded-2xl transition-all duration-300 group cursor-default"
                        style={{
                            backgroundColor: card.bg,
                            border: `1px solid ${card.border}`,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5
                         transition-transform duration-300 group-hover:scale-110"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${card.border}` }}
                        >
                            {card.emoji}
                        </div>
                        <h3
                            className="text-lg font-bold mb-3"
                            style={{ color: card.color, fontFamily: "var(--font-heading)" }}
                        >
                            {card.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                            {card.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── STATS ─────────────────────────────────────────────────────────────────────
const AboutStats = () => (
    <section
        className="py-16 sm:py-20"
        style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(14,165,233,0.05) 100%)",
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
        }}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
                <SectionLabel text="By The Numbers" />
                <SectionHeading>
                    Growing{" "}
                    <span style={{ color: "var(--color-primary)" }}>Every Day</span>
                </SectionHeading>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {STATS.map(({ value, label, emoji, color, bg }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center text-center p-6 rounded-2xl
                       transition-all duration-300 cursor-default"
                        style={{
                            backgroundColor: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.borderColor = color;
                            e.currentTarget.style.boxShadow = `0 8px 24px ${bg}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "var(--color-border)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                            style={{ backgroundColor: bg }}
                        >
                            {emoji}
                        </div>
                        <span
                            className="text-4xl font-bold mb-1"
                            style={{ fontFamily: "var(--font-heading)", color }}
                        >
                            {value}
                        </span>
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── TEAM ──────────────────────────────────────────────────────────────────────
const TeamSection = () => (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
                <SectionLabel text="The Team" />
                <SectionHeading>
                    People Behind{" "}
                    <span style={{ color: "var(--color-primary)" }}>LearnFlow</span>
                </SectionHeading>
                <p className="text-base max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
                    A passionate team of educators, engineers, and designers — united by the
                    belief that great education changes lives.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEAM.map((member) => (
                    <div
                        key={member.name}
                        className="flex flex-col items-center text-center p-6 rounded-2xl
                       transition-all duration-300 group cursor-default"
                        style={{
                            backgroundColor: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-6px)";
                            e.currentTarget.style.borderColor = member.bg;
                            e.currentTarget.style.boxShadow = `0 12px 32px ${member.bg}30`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderColor = "var(--color-border)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {/* Avatar */}
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center
                         text-2xl font-bold text-white mb-4 transition-transform
                         duration-300 group-hover:scale-105"
                            style={{ backgroundColor: member.bg }}
                        >
                            {member.initials}
                        </div>

                        {/* Name + Role */}
                        <h3
                            className="text-base font-bold mb-1"
                            style={{ color: "var(--color-text-heading)", fontFamily: "var(--font-heading)" }}
                        >
                            {member.name}
                        </h3>
                        <p
                            className="text-xs font-semibold mb-3 px-3 py-1 rounded-full"
                            style={{
                                backgroundColor: `${member.bg}18`,
                                color: member.bg,
                            }}
                        >
                            {member.role}
                        </p>

                        {/* Bio */}
                        <p
                            className="text-xs leading-relaxed mb-5"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            {member.bio}
                        </p>

                        {/* Social links */}
                        <div className="flex items-center gap-2 mt-auto">
                            {[
                                { href: member.twitter, Icon: TwitterIcon },
                                { href: member.linkedin, Icon: LinkedinIcon },
                            ].map(({ href, Icon }) => (
                                <a
                                    key={href + member.name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center
                             transition-all duration-150"
                                    style={{
                                        color: "var(--color-text-muted)",
                                        border: "1px solid var(--color-border)",
                                        backgroundColor: "transparent",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = member.bg;
                                        e.currentTarget.style.borderColor = member.bg;
                                        e.currentTarget.style.backgroundColor = `${member.bg}12`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "var(--color-text-muted)";
                                        e.currentTarget.style.borderColor = "var(--color-border)";
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }}
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// ── JOIN CTA ──────────────────────────────────────────────────────────────────
const JoinCTA = () => (
    <section className="py-16" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div
                className="rounded-3xl px-8 py-12 relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #0ea5e9 100%)",
                }}
            >
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }} />
                <div className="relative z-10">
                    <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">
                        Join Us
                    </p>
                    <h2
                        className="text-2xl sm:text-3xl font-bold text-white mb-4"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Ready to Start Learning?
                    </h2>
                    <p className="text-white/75 text-sm mb-7 max-w-md mx-auto">
                        Join 50,000+ learners already building their future on LearnFlow.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/register"
                            className="px-7 py-3 rounded-xl font-bold text-sm transition-all
                         duration-200 hover:scale-105"
                            style={{ backgroundColor: "#fff", color: "#4f46e5" }}
                        >
                            Get Started Free →
                        </Link>
                        <Link
                            to="/contact"
                            className="px-7 py-3 rounded-xl font-semibold text-sm text-white
                         transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.15)",
                                border: "1px solid rgba(255,255,255,0.3)",
                            }}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
const About = () => (
    <div style={{ backgroundColor: "var(--color-bg)" }}>
        <AboutHero />
        <MissionVision />
        <AboutStats />
        <TeamSection />
        <JoinCTA />
    </div>
);

export default About;