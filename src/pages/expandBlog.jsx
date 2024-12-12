import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backend from "../backendString.js"

import {
  blogState,
  expandInfoState,
  tokenState,
  isSignedInState,
} from "../atoms";

const ExpandPost = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200">
      <RenderCar />
      <div className="container mx-auto px-4 py-10">
        <div className="mt-10">
          <Title />
        </div>
        <div className="mt-6">
          <Description />
        </div>
        <div className="mt-8">
          <Delete />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

function Title() {
  const [expandInfo] = useRecoilState(expandInfoState);

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 text-center">
        {expandInfo.title}
      </h1>
    </div>
  );
}

function Description() {
  const [expandInfo] = useRecoilState(expandInfoState);

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
        {expandInfo.description}
      </p>
    </div>
  );
}

function RenderCar() {
  const [expandInfo] = useRecoilState(expandInfoState);

  return (
    <div className="relative w-full h-96 sm:h-[400px] md:h-[500px] overflow-hidden rounded-b-lg shadow-md">
      <img
        src={expandInfo.imgURL}
        alt={expandInfo.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
}

function Delete() {
  const [expandInfo] = useRecoilState(expandInfoState);
  const token = useRecoilValue(tokenState);
  const navigate = useNavigate();
  const [isSignedIn] = useRecoilState(isSignedInState);

  const confirmDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backend}/user/delete/${expandInfo._id}`,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Post deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("You can't delete this post!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="text-center">
      {isSignedIn ? (
        <button
          onClick={confirmDelete}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-all"
        >
          Delete Post
        </button>
      ) : (
        <p className="text-gray-400 italic">Sign in to delete this post</p>
      )}
    </div>
  );
}

export default ExpandPost;