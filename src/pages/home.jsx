import { div, p } from "framer-motion/client";
import React, { useEffect } from "react";
import { bcImgState, blogState, checkVarState, expandInfoState, inUpState, isSignedInState, isSignedUpState, loadingState, loggedInState, nameOfUserState, placeholderEmailState, placeholderPasswordState, placeholderUsernameState, signInFormDataState, signUpFormDataState, targetSectionState, toggleState, tokenState, userpfpState } from "../atoms";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { THEMES } from "../constants/themes.js";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../storage/useThemeStore.js";
import backend from "../backendString.js"

const Home = () => {
    const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState)
    const [isSignedUp, setIsSignedUp] = useRecoilState(isSignedUpState)
    const [isTog, setIsTog] = useRecoilState(toggleState);
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(loggedInState);
    const [token, setToken] = useRecoilState(tokenState)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            setToken(token)
            // Optionally, verify the token's validity here
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
      <div id="top" className="relative">
        <RenderCar/>
        {isTog ? 
        <div className="z-10 absolute top-44 right-20 flex items-center justify-center px-4 py-8">
          {!(isSignedIn) && <LogComponent />}
        </div> : <div></div>
        }
          <div className="min-h-screen flex flex-col items-center justify-center px-8">
              <Intro />
              <div className="flex w-full flex-col items-center justify-center p-8">
                  <BlogShowcase />
              </div>
          </div>
          <div className="relative">
            <div className="mt-28">
              <ThemeSelector />
            </div>
            <div className="flex justify-center">
              <div className="-top-3 flex justify-center absolute">
                <Contact />
              </div>
            </div>
          </div>
          <ToastContainer />
      </div>
    )
}

function Intro() {
    return (
        <div className="sm:mt-5 mt-32 text-xl">
            Find your fav cars right here  
        </div>
    )
}
const BlogShowcase = () => {
    const [blogs, setBlogs] = useRecoilState(blogState);
    const [loading, setLoading] = useRecoilState(loadingState);
  
    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          const response = await axios.get(`${backend}/user/allBlogs`);
          if (Array.isArray(response.data)) {
            setBlogs(response.data); // Ensure the response is an array
          } else {
            console.error("Unexpected response format:", response.data);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        } finally {
          setLoading(false);
        }
      };
      fetchBlogs();
    }, []);
  
    if (loading) {
      return <span className="loading loading-dots loading-lg"></span>
    }
  
    return (
      <div className="sm:w-[90%] px-4"> 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    );
  };
  function BlogCard({ blog }) {
    const navigate = useNavigate();
    const [expandInfo, setExpandInfo] = useRecoilState(expandInfoState);
    const { _id, imgURL, title, description } = blog;
  
    function handleReadMoreClick() {
      setExpandInfo({
        _id,
        imgURL,
        title,
        description,
      });
  
      navigate("/ExpandPost");
    }
  
    return (
      <div className="skeleton flex justify-center">
        <div className="card glass w-full max-w-xs md:max-w-md lg:max-w-lg h-auto">
          <figure>
            <img
              src={blog.imgURL}
              className="h-48 w-full object-cover transition-transform duration-300 transform hover:scale-110"
              alt="car!"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-lg md:text-xl">{blog.title}</h2>
            <p className="text-sm md:text-base">{blog.description.slice(0, 50)}...</p>
            <div className="card-actions justify-end">
              <button onClick={handleReadMoreClick} className="btn btn-primary text-sm md:text-base">
                Read more
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
function RenderCar(){
  const [isTog, setIsTog] = useRecoilState(toggleState);
  const [bcImg, setBcImg] = useRecoilState(bcImgState)
  function toggle(){
    setIsTog(true)
  }
  setBcImg("/assets/images/pexels-a2pro-6729275.jpg");

  return (
    <div>
      {!isTog ? 
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${bcImg})`,
        }}>
        <div className="hero-overlay  bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
            Welcome to SupercarBlog! Explore a world of luxury supercars with our stunning themes. Dive in and start your journey into automotive excellence today!
            </p>
            <button className="btn btn-primary" onClick={toggle}>Get Started</button>
          </div>
        </div>
      </div> : <div className="hidden md:block relative w-full h-full overflow-hidden">
            <img 
                src={bcImg} 
                alt="Descriptive Alt Text" 
                className="w-full h-full opacity-85 object-cover"
            />
        </div>
      }

      

    </div>
    


  )
}



function LogComponent() {
  const [isSignedUp, setIsSignedUp] = useRecoilState(isSignedUpState);
  const [signUpFormData, setSignUpFormData] = useRecoilState(signUpFormDataState);
  const [signInFormData, setSignInFormData] = useRecoilState(signInFormDataState);
  const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);
  const [token, setToken] = useRecoilState(tokenState);
  const [checkVar, setCheckVar] = useRecoilState(checkVarState);
  const [nameOfUser, setNameOfUser] = useRecoilState(nameOfUserState);
  const navigate = useNavigate();
  const [inup, setInup] = useRecoilState(inUpState);
  const [username, setUsername] = useRecoilState(placeholderUsernameState);
  const [email, setEmail] = useRecoilState(placeholderEmailState);
  const [password, setPassword] = useRecoilState(placeholderPasswordState);
  const [userpfp, setUserpfp] = useRecoilState(userpfpState);
  const targetSection = useRecoilValue(targetSectionState);
  
  useEffect(() => {
    if (targetSection === 'mySection') {
      const section = document.getElementById(targetSection);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [targetSection]);

  const toggleInup = () => {
    setInup(e => !e);
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInFormData({
      ...signInFormData,
      [name]: value,
    });
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpFormData({
      ...signUpFormData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (signUpFormData) {
      try {
        const response = await axios.post(`${backend}/user/signup`, signUpFormData);
        if (response.status === 201) {
          toast.success("User Signed Up", {
            position: "bottom-right",
            autoClose: 3000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setUserpfp(response.userpfp);
        } else {
          toast.error("Can't sign up", {
            position: "bottom-right",
            autoClose: 3000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        setIsSignedUp(true);
        setNameOfUser(response.data.nameOfUser);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    } else {
      console.log(signUpFormData);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (signInFormData) {
      try {
        const response = await axios.post(`${backend}/user/signin`, signInFormData);
        console.log(response);
        
        if (response.data.message === "Incorrect Credentials!") {
          toast.error("Incorrect Credentials, please try again.");
          return;
        }

        // Fetching all the data
        setNameOfUser(response.data.nameOfUser);
        setUsername(response.data.username);
        setPassword(response.data.password);
        setEmail(response.data.email);
        setUserpfp(response.data.userpfp);
        setIsSignedIn(true);
        localStorage.setItem("token", response.data.token);
        
        // Navigation logic
        if (checkVar === "direct") {
          navigate("/CreateBlog");
          setCheckVar("");
        } else if (checkVar === "direct2") {
          navigate("/ViewBlogs");
        } else {
          navigate("/");
        }

        setTimeout(() => {
          toast.success("User Signed In", {
            position: "bottom-right",
            autoClose: 3000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }, 100);
      } catch (error) {
        toast.error("Incorrect credentials!", {
          position: "bottom-right",
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error(`Error: ${error}`);
      }
    } else {
      console.log(signInFormData);
    }
  };

  return (
    <div id="mySection" className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-xl px-6 sm:px-8 pt-6 pb-8 mb-4 w-full">
        <div className="mb-6">
          {inup ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
                Sign In
              </h2>
              <div>
                <input 
                  className="w-full px-3 py-2 text-sm sm:text-base bg-white/90 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleSignInChange} 
                  type="email" 
                  placeholder="Enter Your Email" 
                  name="email"
                  required
                /> 
              </div>
              <div>
                <input 
                  className="w-full px-3 py-2 text-sm sm:text-base bg-white/90 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleSignInChange} 
                  type="password" 
                  placeholder="Enter Your Password" 
                  name="password"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
                Sign Up
              </h2>
              <div>
                <input 
                  className="w-full px-3 py-2 text-sm sm:text-base bg-white/90 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleSignUpChange} 
                  type="text" 
                  placeholder="Enter Your Name" 
                  name="username"
                  required
                />
              </div>
              <div>
                <input 
                  className="w-full px-3 py-2 text-sm sm:text-base bg-white/90 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleSignUpChange} 
                  type="email" 
                  placeholder="Enter Your Email" 
                  name="email"
                  required
                /> 
              </div>
              <div>
                <input 
                  className="w-full px-3 py-2 text-sm sm:text-base bg-white/90 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleSignUpChange} 
                  type="password" 
                  placeholder="Enter Your Password" 
                  name="password"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300 text-sm sm:text-base"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
        <div className="text-center">
          <button 
            onClick={toggleInup} 
            className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
          >
            {inup ? "Back to Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

const ThemeSelector = () => {
  const [theme, setTheme] = useTheme();
  return (
      <div id="themeSection" className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="text-sm text-base-content/70">Choose a theme for your interface</p>
          </div>
  
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                  ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
                `}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
              </div>
          </div>
      </div>
  )
}

const Contact = () => {
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
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><a href="https://www.instagram.com/ig_abhii.verma/">Instagram</a></li>
              <li><a href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit">LinkedIn</a></li>
              <li><a href="https://github.com/GIT-Marquestra">Github</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Contact </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a href="https://www.instagram.com/ig_abhii.verma/">Instagram</a></li>
            <li><a href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit">LinkedIn</a></li>
            <li><a href="https://github.com/GIT-Marquestra">Github</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}



export default Home;