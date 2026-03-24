import { BrowserRouter, Routes, Route } from "react-router-dom";
import Display from "./pages/Display";
import Navbar from "./components/Navbar";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />} />
                <Route path="/c" element={<Display />} />
            </Routes>
        </BrowserRouter>
    );
}
