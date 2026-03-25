import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { presets } from "../data/presets";
import { encodeCountdown } from "../lib/encode";
import { saveCountdown, updateCountdown, getSavedCountdowns, deleteCountdown } from "../lib/storage";
import PresetPicker from "../components/PresetPicker";
import StatsPicker from "../components/StatsPicker";
import SavedCountdowns from "../components/SavedCountdowns";

function nextMonth() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
}

export default function Create() {
    const navigate = useNavigate();

    const [preset, setPreset] = useState("custom");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(nextMonth());
    const [time, setTime] = useState("00:00");
    const [message, setMessage] = useState("");
    const [accent, setAccent] = useState("#00ff29");
    const [stats, setStats] = useState(["hours", "minutes"]);
    const [saved, setSaved] = useState(() => getSavedCountdowns());

    useEffect(() => {
        function onStorage(e) {
            if (e.key === "tickdown-saved") setSaved(getSavedCountdowns());
        }
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);
    const [showAllActive, setShowAllActive] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [editingIdx, setEditingIdx] = useState(null);

    const now = new Date();
    const indexed = saved.map((config, idx) => ({ config, idx }));
    const active = indexed
        .filter(({ config }) => new Date(config.targetDate) > now)
        .sort((a, b) => new Date(b.config.targetDate) - new Date(a.config.targetDate));
    const past = indexed
        .filter(({ config }) => new Date(config.targetDate) <= now)
        .sort((a, b) => new Date(a.config.targetDate) - new Date(b.config.targetDate));
    const visibleActive = showAllActive ? active : active.slice(0, 8);

    useEffect(() => {
        document.documentElement.style.setProperty("--accent", accent);
        document.documentElement.style.setProperty("--accent-dim", accent + "33");
    }, [accent]);

    function onPreset(key) {
        setPreset(key);
        const p = presets[key];
        setStats(p.suggestedStats);
        setAccent(p.defaultAccent);
        setMessage(p.defaultMessage);
    }

    function onSubmit(e) {
        e.preventDefault();
        const config = {
            title: title || presets[preset].name,
            targetDate: `${date}T${time}`,
            createdAt: editingIdx !== null ? saved[editingIdx].createdAt : new Date().toISOString(),
            accent,
            message,
            stats,
            preset,
        };
        if (editingIdx !== null) updateCountdown(editingIdx, config);
        else saveCountdown(config);
        setEditingIdx(null);
        setSaved(getSavedCountdowns());
        navigate("/c#" + encodeCountdown(config));
    }

    function onDelete(i) {
        deleteCountdown(i);
        setSaved(getSavedCountdowns());
    }

    function onEdit(config, idx) {
        setPreset(config.preset || "custom");
        setTitle(config.title);
        setDate(config.targetDate.split("T")[0]);
        setTime(config.targetDate.split("T")[1]?.slice(0, 5) || "00:00");
        setMessage(config.message || "");
        setAccent(config.accent);
        setStats(config.stats || []);
        setEditingIdx(idx);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function onCancelEdit() {
        const p = presets["custom"];
        setPreset("custom");
        setTitle("");
        setDate(nextMonth());
        setTime("00:00");
        setMessage(p.defaultMessage);
        setAccent(p.defaultAccent);
        setStats(p.suggestedStats);
        setEditingIdx(null);
    }

    return (
        <div className="min-h-screen pt-16 pb-16 px-4">
            <div className="max-w-xl mx-auto py-8">
                {active.length > 0 && (
                    <div className="mb-10">
                        <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>
                            My countdowns
                        </p>
                        <SavedCountdowns items={visibleActive} onDelete={onDelete} onEdit={onEdit} />
                        {active.length > 8 && (
                            <button
                                onClick={() => setShowAllActive((v) => !v)}
                                className="text-xs mt-2"
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--text-dim)",
                                    cursor: "pointer",
                                    padding: 0,
                                }}
                            >
                                {showAllActive ? "show less" : `${active.length - 8} more`}
                            </button>
                        )}
                    </div>
                )}

                <form onSubmit={onSubmit} className="flex flex-col gap-5 mt-4">
                    <PresetPicker selected={preset} onChange={onPreset} />

                    <div
                        className="p-4 rounded-xl flex flex-col gap-3"
                        style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
                    >
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={presets[preset].name}
                            maxLength={60}
                        />
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs mb-1.5 block" style={{ color: "var(--text-dim)" }}>
                                    Date
                                </label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            <div style={{ width: "7rem" }}>
                                <label className="text-xs mb-1.5 block" style={{ color: "var(--text-dim)" }}>
                                    Time
                                </label>
                                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs mb-1.5 block" style={{ color: "var(--text-dim)" }}>
                                Message when done
                            </label>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="e.g. LET'S Gooo!!!"
                                maxLength={80}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={accent}
                            onChange={(e) => setAccent(e.target.value)}
                            style={{
                                width: "2rem",
                                height: "2rem",
                                border: "none",
                                padding: 0,
                                background: "none",
                                cursor: "pointer",
                                borderRadius: "50%",
                            }}
                        />
                        <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                            color
                        </span>
                    </div>

                    <div>
                        <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>
                            Stats to show
                        </p>
                        <StatsPicker selected={stats} onChange={setStats} />
                    </div>

                    <div className="flex gap-2 mt-2">
                        {editingIdx !== null && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="flex-1 py-3 rounded-xl font-semibold text-base"
                                style={{
                                    background: "transparent",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-dim)",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl font-semibold text-base"
                            style={{ background: accent, color: "#050508", border: "none", cursor: "pointer" }}
                        >
                            {editingIdx !== null ? "Save" : "Create countdown"}
                        </button>
                    </div>
                </form>

                {past.length > 0 && (
                    <div className="mt-8">
                        <button
                            onClick={() => setShowHistory((v) => !v)}
                            className="text-xs mb-2"
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-dim)",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        >
                            {showHistory ? "hide history" : `history (${past.length})`}
                        </button>
                        {showHistory && <SavedCountdowns items={past} onDelete={onDelete} onEdit={onEdit} />}
                    </div>
                )}
            </div>
        </div>
    );
}
