export default function PresetPicker({ selected, onChange }) {
    const s = (key, last) => ({
        background: selected === key ? "var(--accent-dim)" : "var(--bg-card)",
        color: selected === key ? "var(--accent)" : "var(--text-dim)",
        border: "none",
        borderRight: last ? "none" : "1px solid var(--border)",
        cursor: "pointer",
    });

    return (
        <div
            className="flex w-full"
            style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}
        >
            <button
                type="button"
                onClick={() => onChange("vacation")}
                className="flex-1 py-2 text-sm font-medium"
                style={s("vacation")}
            >
                Vacation
            </button>
            <button
                type="button"
                onClick={() => onChange("exam")}
                className="flex-1 py-2 text-sm font-medium"
                style={s("exam")}
            >
                Exam
            </button>
            <button
                type="button"
                onClick={() => onChange("birthday")}
                className="flex-1 py-2 text-sm font-medium"
                style={s("birthday")}
            >
                Birthday
            </button>
            <button
                type="button"
                onClick={() => onChange("newYear")}
                className="flex-1 py-2 text-sm font-medium"
                style={s("newYear")}
            >
                New Year
            </button>
            <button
                type="button"
                onClick={() => onChange("custom")}
                className="flex-1 py-2 text-sm font-medium"
                style={s("custom", true)}
            >
                Custom
            </button>
        </div>
    );
}
