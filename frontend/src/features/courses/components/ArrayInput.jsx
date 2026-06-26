import { useState } from "react";

const ArrayInput = ({ label, placeholder, values = [], onChange }) => {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setInput("");
  };

  const remove = (index) => onChange(values.filter((_, i) => i !== index));

  const handleKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); add(); }
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="input-field"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold
                     text-white transition-all duration-150 disabled:opacity-40
                     disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Add
        </button>
      </div>

      {values.length > 0 ? (
        <ul className="space-y-2">
          {values.map((item, i) => (
            <li key={i}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(99,102,241,0.06)",
                  border:          "1px solid rgba(99,102,241,0.15)",
                }}>
              <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center
                               justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}>
                {i + 1}
              </span>
              <span className="flex-1" style={{ color: "var(--color-text)" }}>{item}</span>
              <button type="button" onClick={() => remove(i)}
                      className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--color-error)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Type and press Enter or click Add
        </p>
      )}
    </div>
  );
};

export default ArrayInput;