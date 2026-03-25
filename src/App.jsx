import { BrowserRouter, Routes, Route } from "react-router-dom";
import Display from "./pages/Display";
import Navbar from "./components/Navbar";
import Create from "./pages/Create";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <Create />
                        </>
                    }
                />
                <Route path="/c" element={<Display />} />
            </Routes>
        </BrowserRouter>
    );
}
