import { useNavigate } from "react-router-dom";
import { encodeCountdown } from "../lib/encode";

// items as (config and idx) where idk is the og index in storage
export default function SavedCountdowns({ items, onDelete, onEdit }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2">
            {items.map(({ config, idx }) => {
                const diff = new Date(config.targetDate) - new Date();
                const daysLeft = diff > 0 ? Math.floor(diff / 86400000) : null;

                return (
                    <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                        style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
                    >
                        <div className="felx-1 min-w-0">
                            <p className="text-sm font-medium truncate">{config.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                                {daysLeft !== null
                                    ? `${daysLeft} days left`
                                    : new Date(config.targetDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2 ml-3 shrink-0">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(config, idx)}
                                    className="text-xs px-2.5 py-1.5 rounded"
                                    style={{
                                        background: "none",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-dim)",
                                        cursor: "pointer",
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => navigate("/c#" + encodeCountdown(config))}
                                className="text-xs px-2.5 py-1.5 rounded"
                                style={{
                                    background: config.accent + "33",
                                    color: config.accent,
                                    border: `1px solid ${config.accent}`,
                                    cursor: "pointer",
                                }}
                            >
                                Open
                            </button>
                            <button
                                onClick={() => onDelete(idx)}
                                className="text-xs px-2 py-1.5"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--text-muted)",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                                onMouseLeave={(e) => (e.currentTarget.Target.style.color = "var(--text-muted)")}
                            >
                                x
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
