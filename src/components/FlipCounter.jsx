import FlipDigit from "./FlipDigit";

function Group({ value, label }) {
    const s = String(value).padStart(2, "0");
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
                {s.split("").map((d, i) => (
                    <FlipDigit key={s.length - 1 - i} digit={d} />
                ))}
            </div>
            <span className="text-xs font-semibold tracking-widest" style={{ color: "var(--text-dim)" }}>
                {label}
            </span>
        </div>
    );
}

export default function FlipCounter({ days, hours, minutes, seconds, accent }) {
    const dot = (
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
    );
    const colon = (
        <div className="flex flex-col gap-2.5 pb-5">
            {dot}
            {dot}
        </div>
    );

    return (
        <div className="flex items-center justify-center gap-2 md:gap-3">
            <Group value={days} label="DAYS" />
            {colon}
            <Group value={hours} label="HRS" />
            {colon}
            <Group value={minutes} label="MIN" />
            {colon}
            <Group value={seconds} label="SEC" />
        </div>
    );
}
