const InstructorDashboard = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3"
       style={{ backgroundColor: "var(--color-bg)" }}>
    <span className="text-5xl">🧑‍🏫</span>
    <h1 className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-heading)" }}>
      Instructor Dashboard
    </h1>
    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      Phase 2 — coming soon
    </p>
  </div>
);
export default InstructorDashboard;