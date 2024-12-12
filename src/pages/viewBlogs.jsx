import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { expandInfoState, isSignedInState, myBlogState, tokenState } from "../atoms";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backend from "../backendString.js"

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const ViewBlogs = () => {
  const [isSigned, setIsSignedIn] = useRecoilState(isSignedInState)
  const [myBlogs, setMyBlogs] = useRecoilState(myBlogState);


    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        {myBlogs[0] ? 
        <Intro /> : <h2>You haven't created any blogs yet!</h2>
        }
        <div className="flex w-full flex-col items-center justify-center p-8">
          <RenderMyBlogs/>
        </div>
        <ToastContainer />
      </div>
    )

}

function Intro(){
    return (
        <div className="text-bold mt-36">
            Here are your blogs
        </div>
    )
}

const RenderMyBlogs = () => {
  const [myBlogs, setMyBlogs] = useRecoilState(myBlogState);
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    async function fetchBlogs() {
      if (!token) return; // Exit if no token is present
      try {
        const response = await axios.get(`${backend}/user/userBlogs`, {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        });
        if (Array.isArray(response.data)) {
          setMyBlogs(response.data); // Ensure the response is an array
          console.log(response.data[0])
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchBlogs();
  }, [token]);

  return (
    <div className="sm:w-[90%] mx-auto px-4 py-8"> {/* Centered outer container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Grid layout */}
        {myBlogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};



function BlogCard({ blog }) {
  const navigate = useNavigate();
  const [expandInfo, setExpandInfo] = useRecoilState(expandInfoState)
  const { _id, imgURL, title, description } = blog
  function handleReadMoreClick(){

    setExpandInfo({
      _id,
      imgURL,
      title,
      description
    })

    navigate("/ExpandPost")

  }
    return (
      <div className="skeleton">
        <div className="card glass w-96 h-96">
          <figure>
            <img
              src={blog.imgURL}
              className="h-full w-full object-cover transition-transform duration-300 transform hover:scale-110"
              alt="car!" />
              
          </figure>
          <div className="card-body">
            <h2 className="card-title">{blog.title}</h2>
            <p>{blog.description.slice(0, 50)}...</p>
            <div className="card-actions justify-end">
              <button onClick={handleReadMoreClick} className="btn btn-primary">Read more</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default ViewBlogs;


// check for token.
// render signup page if not signed in. 