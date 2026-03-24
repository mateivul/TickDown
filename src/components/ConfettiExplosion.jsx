import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiExplosion({ active }) {
    useEffect(() => {
        if (!active) return;

        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });

        const sideBlast = setTimeout(() => {
            confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
        }, 500);

        let count = 0;
        const rain = setInterval(() => {
            if (count++ > 16) {
                clearInterval(rain);
                return;
            }
            confetti({ particleCount: 20, spread: 100, origin: { x: Math.random(), y: -0.1 }, gravity: 0.5 });
        }, 300);
        return () => {
            clearTimeout(sideBlast);
            clearInterval(rain);
        };
    }, [active]);
    return null;
}
