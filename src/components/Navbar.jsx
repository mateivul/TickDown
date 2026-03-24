import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 flex items-center px-5 py-3"
            style={{
                background: "rgba(5,5,8,0.9",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid var(--border)",
            }}
        >
            <Link to="/" style={{ textDecoration: "none" }}>
                <span className="font-bold text-lg" style={{ fontFamily: "Space Grotesk", color: "var(--accent)" }}>
                    TickDown
                </span>
            </Link>
        </nav>
    );
}
