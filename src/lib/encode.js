// for encoding count down config into URL for sharing as links
export function encodeCountdown(config) {
    const params = new URLSearchParams();
    params.set("t", config.title);
    params.set("d", config.targetDate);
    params.set("s", config.createdAt);
    params.set("c", config.accent);
    if (config.message) params.set("msg", config.message);
    if (config.stats && config.stats.length) params.set("stats", config.stats.join(","));
    if (config.preset) params.set("preset", config.preset);
    return params.toString();
}

export function decodeCountdown(hash) {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    return {
        title: params.get("t") || "Countdown",
        targetDate: params.get("d") || new Date().toISOString(),
        createdAt: params.get("s") || new Date().toISOString(),
        accent: params.get("c") || "#00e87a",
        message: params.get("msg") || "",
        stats: params.get("stats") ? params.get("stats").split(",") : [],
        preset: params.get("preset") || "custom",
    };
}
