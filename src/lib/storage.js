const KEY = "tickdown-saved";

export function getSavedCountdowns() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
}

export function saveCountdown(config) {
    const saved = getSavedCountdowns();
    const exists = saved.findIndex((s) => s.title === config.title && s.targetDate === config.targetDate);
    if (exists >= 0) saved[exists] = config;
    else saved.unshift(config);
    localStorage.setItem(KEY, JSON.stringify(saved));
}

export function updateCountdown(index, config) {
    const saved = getSavedCountdowns();
    saved[index] = config;
    localStorage.setItem(KEY, JSON.stringify(saved));
}

export function deletCountdown(index) {
    const saved = getSavedCountdowns();
    saved.splice(index, 1);
    localStorage.setItem(KEY, JSON.stringify(saved));
}
