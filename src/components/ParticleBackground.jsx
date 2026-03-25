import { useRef, useEffect } from "react";

export default function ParticleBackground({ color }) {
    const canvasRef = useRef(null);
    const colorRef = useRef(color);

    useEffect(() => {
        colorRef.current = color;
    }, [color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        const particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.25 + 0.05,
            });
        }

        function resize() {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            for (const p of particles) {
                p.x = Math.min(p.x, window.innerWidth);
                p.y = Math.min(p.y, window.innerHeight);
            }
        }
        resize();
        window.addEventListener("resize", resize);

        let frameId;
        function animate() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = window.innerWidth;
                if (p.x > window.innerWidth) p.x = 0;
                if (p.y < 0) p.y = window.innerHeight;
                if (p.y > window.innerHeight) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = colorRef.current;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            frameId = requestAnimationFrame(animate);
        }
        animate();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
        />
    );
}
