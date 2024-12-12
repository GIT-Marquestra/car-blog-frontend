import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import CreateBlog from "./pages/createBlog.jsx";
import ViewBlogs from "./pages/viewBlogs.jsx";
import Navbar from "./components/navbar.jsx";
import ProfileUp from "./pages/profileUp.jsx";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExpandPost from "./pages/expandBlog.jsx";
import { useTheme } from "./storage/useThemeStore.js";
// import Log from "./pages/loginSignup.jsx";




function App() {
    const [theme, setTheme] = useTheme();
    return (
        <div data-theme={theme}>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/CreateBlog" element={<CreateBlog/>}/>
                    <Route path="/ViewBlogs" element={<ViewBlogs/>}/>
                    <Route path="/ExpandPost" element={<ExpandPost/>}/>
                    <Route path="/ProfileUp" element={<ProfileUp/>}/>
                </Routes>
            </Router>

        </div>
    )
  
}

export default App
