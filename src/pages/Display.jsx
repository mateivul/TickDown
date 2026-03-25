import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeCountdown } from "../lib/encode";
import FlipCounter from "../components/FlipCounter";
import SubStats from "../components/SubStats";
import ParticleBackground from "../components/ParticleBackground";
import ConfettiExplosion from "../components/ConfettiExplosion";

export default function Display() {
    const location = useLocation();
    const navigate = useNavigate();
    const hash = location.hash;
    const config = useMemo(() => {
        if (!hash || hash.length <= 1) return null;
        return decodeCountdown(hash);
    }, [hash]);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [now, setNow] = useState(new Date());
    const [isFinished, setIsFinished] = useState(false);
    const [copied, setCopied] = useState(false);
    const [notifyEnabled, setNotifyEnabledState] = useState(false);
    const [minimal, setMinimal] = useState(false);
    const intervalRef = useRef(null);
    const notifyRef = useRef(false);

    function setNotifyEnabled(val) {
        notifyRef.current = val;
        setNotifyEnabledState(val);
    }

    const notifySupported = typeof window !== "undefined" && "Notification" in window;
    const [notifyPermission, setNotifyPermission] = useState(notifySupported ? Notification.permission : "denied");
    const notifyDenied = notifyPermission === "denied";

    async function onToggleNotify() {
        if (!notifySupported || notifyDenied) return;
        if (notifyPermission === "default") {
            const result = await Notification.requestPermission();
            setNotifyPermission(result);
            if (result === "granted") setNotifyEnabled(true);
        } else {
            setNotifyEnabled(!notifyRef.current);
        }
    }

    useEffect(() => {
        if (!config) {
            navigate("/");
            return;
        }
        document.documentElement.style.setProperty("--accent", config.accent);
        document.documentElement.style.setProperty("--accent-dim", config.accent + "33");
    }, [config, navigate]);

    useEffect(() => {
        if (!config) return;

        function tick() {
            const n = new Date();
            const diff = new Date(config.targetDate) - n;
            setNow(n);
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsFinished(true);
                document.title = config.title + " - done";
                clearInterval(intervalRef.current);
                if (notifySupported && Notification.permission === "granted" && notifyRef.current)
                    new Notification(config.title, { body: config.message || "It's done!!" });
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            document.title = `${d}d ${h}h - ${config.title}`;
            setTimeLeft({
                days: d,
                hours: h,
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        }

        tick();
        intervalRef.current = setInterval(tick, 1000);
        return () => {
            clearInterval(intervalRef.current);
            document.title = "TickDown";
        };
    }, [config, notifySupported]);

    useEffect(() => {
        if (!isFinished) return;
        const ctx = new AudioContext();
        [523, 659, 784].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            osc.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = "sine";
            const t = ctx.currentTime + i * 0.18;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.25, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
            osc.start(t);
            osc.stop(t + 0.9);
        });
    }, [isFinished]);

    function onToggleMinimal() {
        const next = !minimal;
        setMinimal(next);
        if (next) {
            document.documentElement.requestFullscreen?.();
        } else {
            if (document.fullscreenElement) document.exitFullscreen?.();
        }
    }

    async function onCopy() {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (!config) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div
                    className="w-7 h-7 rounded-full border-2 animate-spin"
                    style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                />
            </div>
        );
    }

    const accent = config.accent;

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
            <ParticleBackground color={accent + "28"} />
            <ConfettiExplosion active={isFinished} />

            {minimal && (
                <button
                    onClick={onToggleMinimal}
                    style={{
                        position: "fixed",
                        top: "1rem",
                        right: "1rem",
                        zIndex: 20,
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--text-dim)",
                        borderRadius: "8px",
                        padding: "0.4rem 0.75rem",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                    }}
                >
                    x exit focus
                </button>
            )}

            <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
                {isFinished ? (
                    <div className="completion-msg flex flex-col items-center gap-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold" style={{ color: accent }}>
                            {config.message || "It's done!!!"}
                        </h1>
                        <p className="text-xl" style={{ color: "var(--text-dim)" }}>
                            the countdown is done
                        </p>
                    </div>
                ) : (
                    <>
                        {!minimal && (
                            <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">{config.title}</h1>
                        )}

                        <div
                            className="p-6 md:p-10 rounded-2xl"
                            style={{
                                background: "rgba(15,18,25,0.75)",
                                border: `1px solid ${accent}20`,
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            <FlipCounter
                                days={timeLeft.days}
                                hours={timeLeft.hours}
                                minutes={timeLeft.minutes}
                                seconds={timeLeft.seconds}
                                accent={accent}
                            />
                        </div>

                        {!minimal &&
                            config.createdAt &&
                            (() => {
                                const total = new Date(config.targetDate) - new Date(config.createdAt);
                                const elapsed = new Date() - new Date(config.createdAt);
                                const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
                                return (
                                    <div className="w-full max-w-sm mt-4 mx-auto">
                                        <div
                                            className="h-0.5 rounded-full overflow-hidden"
                                            style={{ background: "var(--border)" }}
                                        >
                                            <div
                                                style={{
                                                    width: `${pct}%`,
                                                    height: "100%",
                                                    background: accent,
                                                    transition: "width 1s linear",
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs mt-1 text-right" style={{ color: "var(--text-dim)" }}>
                                            {Math.round(pct)}% through
                                        </p>
                                    </div>
                                );
                            })()}

                        {!minimal && config.stats?.length > 0 && (
                            <SubStats statIds={config.stats} target={config.targetDate} accent={accent} now={now} />
                        )}
                    </>
                )}

                {!minimal && (
                    <div className="flex items-center gap-2 mt-10 flex-wrap justify-center">
                        <button
                            onClick={() => navigate("/")}
                            className="px-3 py-2 text-sm rounded-lg"
                            style={{
                                background: "transparent",
                                border: "1px solid var(--border)",
                                color: "var(--text-dim)",
                                cursor: "pointer",
                            }}
                        >
                            ← My countdowns
                        </button>
                        <button
                            onClick={onCopy}
                            className="px-3 py-2 text-sm rounded-lg"
                            style={{
                                background: "transparent",
                                border: `1px solid ${copied ? accent : "var(--border)"}`,
                                color: copied ? accent : "var(--text-dim)",
                                cursor: "pointer",
                            }}
                        >
                            {copied ? "Copied!" : "Copy link"}
                        </button>
                        {notifySupported && !isFinished && (
                            <button
                                onClick={onToggleNotify}
                                title={notifyDenied ? "Notification blocked, enable in browser settings" : ""}
                                className="px-3 py-2 text-sm rounded-lg"
                                style={{
                                    background: "transparent",
                                    border: `1px solid ${notifyEnabled ? accent : "var(--border)"}`,
                                    color: notifyEnabled ? accent : "var(--text-dim)",
                                    cursor: notifyDenied ? "not-allowed" : "pointer",
                                    opacity: notifyDenied ? 0.5 : 1,
                                }}
                            >
                                {notifyEnabled ? "Notify me ✓" : "Notify me"}
                            </button>
                        )}
                        {!isFinished && (
                            <button
                                onClick={onToggleMinimal}
                                className="px-3 py-2 text-sm rounded-lg"
                                style={{
                                    background: "transparent",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-dim)",
                                    cursor: "pointer",
                                }}
                            >
                                Focus
                            </button>
                        )}
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 text-sm font-semibold rounded-lg"
                            style={{ background: accent, border: "none", color: "#050508", cursor: "pointer" }}
                        >
                            Create your own
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
