function countDays(start, end, test) {
    let n = 0;
    const d = new Date(start);
    d.setHours(0, 0, 0, 0);
    const e = new Date(end);
    e.setHours(0, 0, 0, 0);
    while (d < e) {
        if (test(d.getDay())) n++;
        d.setDate(d.getDate() + 1);
    }
    return n;
}

function ms(now, target) {
    return Math.max(0, new Date(target) - now);
}

export const availableStats = {
    schoolDays: {
        label: "Weekdays",
        calculate: (now, target) => countDays(now, new Date(target), (d) => d !== 0 && d !== 6),
        format: (val) => val.toLocaleString(),
    },
    weekends: {
        label: "Weekends",
        calculate: (now, target) => Math.floor(countDays(now, new Date(target), (d) => d === 0 || d === 6) / 2),
        format: (val) => val.toLocaleString(),
    },
    weeks: {
        label: "Weeks",
        calculate: (now, target) => Math.floor(ms(now, target) / 604800000),
        format: (val) => val.toLocaleString(),
    },
    hours: {
        label: "Hours",
        calculate: (now, target) => Math.floor(ms(now, target) / 3600000),
        format: (val) => val.toLocaleString(),
    },
    minutes: {
        label: "Minutes",
        calculate: (now, target) => Math.floor(ms(now, target) / 60000),
        format: (val) => val.toLocaleString(),
    },
    workdayBar: {
        label: "Workdays vs free days",
        calculate: (now, target) => {
            const work = countDays(now, new Date(target), (d) => d !== 0 && d !== 6);
            const free = countDays(now, new Date(target), (d) => d === 0 || d === 6);
            return { work, free, total: work + free };
        },
        format: null,
        isBar: true,
    },
    funSleep: {
        label: "Nights of sleep",
        calculate: (now, target) => Math.floor(ms(now, target) / 86400000),
        format: (val) => val.toLocaleString(),
    },
    funMeals: {
        label: "Meals remaining",
        calculate: (now, target) => Math.floor((ms(now, target) / 86400000) * 3),
        format: (val) => val.toLocaleString(),
    },
};
