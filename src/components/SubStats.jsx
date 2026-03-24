import { availableStats } from "../lib/stats";

function BarStat({ stat, now, target, accent }) {
    const { work, free, total } = stat.calculate(now, target);
    const pct = total > 0 ? Math.round((work / total) * 100) : 50;

    return (
        <div
            className="col-span-full p-4 rounded-lg"
            style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
        >
            <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-dim)" }}>
                <span>{stat.label}</span>
                <span style={{ fontFamily: "JetBrains Mono" }}>
                    {work} / {free}
                </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: "var(--bg)" }}>
                <div
                    className="h-full"
                    style={{
                        width: `${pct}%`,
                        background: accent,
                        borderRadius: "9999px 0 0 9999px",
                        transition: "width 0.5s",
                    }}
                />
                <div
                    className="h-full"
                    style={{
                        width: `${100 - pct}%`,
                        background: "var(--text-muted)",
                        borderRadius: "0 9999px 9999px 0",
                    }}
                />
            </div>
            <div className="flex justify-between text-xs mt-1.5" style={{ color: "var(--text-dim)" }}>
                <span>Workdays ({pct}%)</span>
                <span>Free days ({100 - pct}%)</span>
            </div>
        </div>
    );
}

export default function SubStats({ statIds, target, accent, now }) {
    const ids = statIds.filter((id) => availableStats[id]);
    if (ids.length === 0) return null;

    const regular = ids.filter((id) => !availableStats[id].isBar);
    const bars = ids.filter((id) => availableStats[id].isBar);

    return (
        <div className="w-full max-w-3xl mx-auto mt-6">
            {regular.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols3 md:grid-cols-4 gap-2 mb-2">
                    {regular.map((id) => {
                        const stat = availableStats[id];
                        return (
                            <div
                                key={id}
                                className="flex flex-col items-center p-3 rounded-lg"
                                style={{ border: "1px solid var(--border)", background: "var(--bg-card)" }}
                            >
                                <span
                                    className="text-xl font-bold"
                                    style={{ fontFamily: "JetBrains Mono", color: accent }}
                                >
                                    {stat.format(stat.calculate(now, target))}
                                </span>
                                <span className="text-xs text-center mt-0.5" style={{ color: "var(--text-dim)" }}>
                                    {stat.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
            {bars.length > 0 && (
                <div className="flex flex-col gap-2">
                    {bars.map((id) => (
                        <BarStat key={id} stat={availableStats[id]} now={now} target={target} accent={accent} />
                    ))}
                </div>
            )}
        </div>
    );
}
