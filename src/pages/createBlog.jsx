import React from "react";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { formDataState, imageState, isUploadingState, tokenState, checkVarState, isSignedInState, isSignedUpState } from "../atoms.js";
import { div } from "framer-motion/client";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backend from "../backendString.js"


const CreateBlog = () => {
    return (
        <div className="relative flex justify-center items-center">
            <RenderCar />
            <div className="absolute max-w-2xl mx-auto bg-white/30 backdrop-blur-lg backdrop-saturate-150 rounded-3xl shadow-2xl p-8 border border-white/20">
                <h1 className="text-3xl font-extrabold text-center text-white mb-6">
                    Create Your Blog Post
                </h1>
                <Form />
            </div>
            <ToastContainer />
        </div>
    );
};

const RenderCar = () => {
    return (
        <div className="hidden md:block relative w-full h-full overflow-hidden">
            <img 
                src="/assets/images/bk.jpg" 
                alt="Descriptive Alt Text" 
                className="w-full h-full object-cover"
            />
        </div>
    )
}

const Form = () => {
    const [formData, setFormData] = useRecoilState(formDataState);
    const [image, setImage] = useRecoilState(imageState);
    const [isUploading, setIsUploading] = useRecoilState(isUploadingState);
    const navigate = useNavigate();

    const [checkVar, setCheckVar] = useRecoilState(checkVarState);
    const token = useRecoilValue(tokenState); // using token here for the middleware
    const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);
    const [isSignedUp, setIsSignedUp] = useRecoilState(isSignedUpState);

    const imgURLref = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        if (image) {
            const imageData = new FormData();
            imageData.append("file", image);
            imageData.append("upload_preset", "my_unsigned_preset");

            try {
                const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/dutrfbtao/image/upload`, imageData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                imgURLref.current = cloudinaryResponse.data.secure_url;

                const response = await axios.post(`${backend}/user/createBlog`, {
                    ...formData,
                    imgURL: imgURLref.current,
                }, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 201) {
                    toast.success("Blog created!", {
                        position: "top-right",
                        autoClose: 3000, 
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    setFormData({
                        title: "",
                        description: "",
                        imgURL: "",
                    });
                    setImage(null);
                }
            } catch (error) {
                console.error("Error: ", error);
                toast.error("Failed to create Blog", {
                    position: "top-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div>{isSignedIn || isSignedUp ? 
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter Title"
                        name="title"
                        className="input input-ghost w-full max-w-xs"
                        required
                    />
                </div>
                <div>
                    <textarea
                        onChange={handleChange}
                        placeholder="Enter Description"
                        name="description"
                        className="input input-ghost w-full max-w-xs"
                        required
                        rows="4"
                    />
                </div>
                <div>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        required
                        name="imgURL"
                        className="input input-ghost w-full max-w-xs"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    {isUploading ? "Uploading..." : "Create Blog"}
                </button>
            </form> : toast.error("Please signIn/signUp first", {
                position: "top-right",
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })

        } 

            
        </div>
    );
};

export default CreateBlog;