import { availableStats } from "../lib/stats";

export default function StatsPicker({ selected, onChange }) {
    function toggle(id) {
        onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
            {Object.keys(availableStats).map((id) => {
                const stat = availableStats[id];
                const on = selected.includes(id);
                return (
                    <label
                        key={id}
                        className="flex items-center gap-3 px-2 py-2 rounded cursor-pointer"
                        style={{ background: on ? "rgba(255,255,255,0.03)" : "transparent" }}
                    >
                        <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle(id)}
                            style={{
                                accentColor: "var(--accent)",
                                cursor: "pointer",
                                width: "0.9rem",
                                height: "0.9rem",
                            }}
                        />
                        <span className="text-sm" style={{ color: on ? "var(--text)" : "var(--text-dim)" }}>
                            {stat.label}
                        </span>
                    </label>
                );
            })}
        </div>
    );
}
