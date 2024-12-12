import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isSignedInState, checkVarState, nameOfUserState, isSignedUpState, placeholderUsernameState, userpfpState, targetSectionState } from "../atoms.js";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Menu, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
    const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);
    const [isSignedUp, setIsSignedUp] = useRecoilState(isSignedUpState);
    const navigate = useNavigate();
    const [checkVar, setCheckVar] = useRecoilState(checkVarState);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const nameOfUser = useRecoilValue(nameOfUserState);
    const username = useRecoilValue(placeholderUsernameState);
    const [userpfp, setUserpfp] = useRecoilState(userpfpState);
    const setTargetSection = useSetRecoilState(targetSectionState);

    const handleScrollToSection = (sectionId, offset = 0) => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: sectionTop - offset, // Scroll to the top of the section minus the offset
                behavior: 'smooth',
            });
        }
    };

    function handleCreateBlogClick() {
        console.log(isSignedIn) // false
        console.log(isSignedUp) // true
        // if (!(isSignedIn || isSignedUp)) {
        //     // navigate("/SignUp");
        //     window.alert("Please SignUp/SignIn First!")
        //     setCheckVar("direct");
        // } else {
        //     navigate("/CreateBlog");
        // }

        if (!(isSignedIn || isSignedUp)){
            toast.error("Please signIn/signUp first", {
                position: "bottom-right",
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            setCheckVar("direct");
        } else {
            navigate("/CreateBlog");
        }
        

        setIsMenuOpen(false);
    }

    function handleYourBlogsClick() {
        if (!(isSignedIn || isSignedUp)) {
            // navigate("/SignUp");
            toast.error("Please signIn/signUp first", {
                position: "bottom-right",
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            setCheckVar("direct2");
        } else {
            navigate("/ViewBlogs");
        }
        setIsMenuOpen(false);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleProfileUp = () => {
        navigate("/ProfileUp")
    }

    return (
        <div className="flex justify-center items-center">
            {/* <div className="fixed h-3 top-16 bg-blue-500 w-[20%] text-blue-500">
              <Light />
            </div> */}
            <nav className="fixed top-10 w-[90%] bg-white/30 backdrop-blur-lg border-2 border-gray-300 shadow-lg z-50 rounded-lg transition duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo or Brand (optional) */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-xl font-bold text-gray-800">
                                SuperCarBlog
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <ul className="flex space-x-6 text-base font-semibold text-gray-800">
                                <li>
                                    <Link to="/" className="rounded-md">
                                        <button className="btn btn-ghost">Home</button>
                                    </Link>
                                </li>
                                {isSignedIn ? 
                                <li>
                                    <button
                                        onClick={handleCreateBlogClick}
                                        className="btn btn-ghost"
                                    >
                                        Create Blog
                                    </button>
                                </li> : <li>
                                    <button className="btn btn-ghost">Sign In to Post</button>
                                </li>
                                }
                                <li>
                                    <button onClick={() => handleScrollToSection('themeSection', 200)} className="btn btn-ghost">Themes</button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleYourBlogsClick}
                                        className="btn btn-ghost"
                                    >
                                        Your Blogs
                                    </button>
                                </li>
                                {(isSignedIn || isSignedUp) ? 
                                    <li className="flex">
                                        <button onClick={handleProfileUp} className="btn btn-ghost">Hi {username}</button>
                                        <div className="avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={userpfp} />
                                            </div>
                                        </div>
                                    </li>
                                    : 
                                    <li>
                                        <button onClick={() => handleScrollToSection('mySection', 200)} className="btn btn-ghost">Sign Up</button>
                                    </li>
                                }
                            </ul>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={toggleMenu}
                                className="btn btn-ghost"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden absolute left-0 right-0 top-16 bg-white/90 backdrop-blur-lg shadow-lg">
                            <ul className="flex flex-col items-center space-y-2 py-4 text-base font-semibold text-gray-800">
                                <li>
                                    <Link 
                                        to="/" 
                                        className="hover:text-blue-500 px-3 py-2 rounded-md block"
                                        onClick={closeMenu}
                                    >
                                        Home
                                    </Link>
                                </li>
                                {isSignedIn ? 
                                <li>
                                    <button
                                        onClick={handleCreateBlogClick}
                                        className="btn btn-ghost"
                                    >
                                        Create Blog
                                    </button>
                                </li> : <li>Sign In to Post</li>
                                }
                                <li>
                                    <button onClick={() => handleScrollToSection('themeSection')} className="btn btn-ghost">Themes</button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleYourBlogsClick}
                                        className="btn btn-ghost"
                                    >
                                        Your Blogs
                                    </button>
                                </li>
                                {(isSignedIn || isSignedUp) ? 
                                    <li className="flex">
                                        <button onClick={handleProfileUp} className="btn btn-ghost">Hi {username}</button>
                                        <div className="avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={userpfp} />
                                            </div>
                                        </div>
                                    </li>
                                    : 
                                    <li>
                                        <button onClick={() => handleScrollToSection('mySection')} className="btn btn-ghost">Sign Up</button>
                                    </li>
                                }
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};


export default Navbar;