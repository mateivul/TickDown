import { useEffect, useState, useRef } from "react";

export default function FlipDigit({ digit }) {
    const [prevDigit, setPrevDigit] = useState(digit);
    const [isFlipping, setIsFlipping] = useState(false);
    const prevRef = useRef(digit);
    const flipKey = useRef(0);

    useEffect(() => {
        if (digit !== prevRef.current) {
            setPrevDigit(prevRef.current);
            flipKey.current += 1;
            setIsFlipping(true);
            prevRef.current = digit;
            const t = setTimeout(() => setIsFlipping(false), 520);
            return () => clearTimeout(t);
        }
    }, [digit]);

    return (
        <div className="flip-card" style={{ width: "3.2rem", height: "4.2rem" }}>
            <div className="flip-digit-top">
                <span>{digit}</span>
            </div>
            <div className="flip-digit-bottom">
                <span>{digit}</span>
            </div>

            {isFlipping && (
                <div key={`top-${flipKey.current}`} className="flip-digit-top flip-animation-top">
                    <span>{prevDigit}</span>
                </div>
            )}
            {isFlipping && (
                <div key={`bot-${flipKey.current}`} className="flip-digit-bottom flip-animation-bottom">
                    <span>{digit}</span>
                </div>
            )}
        </div>
    );
}
