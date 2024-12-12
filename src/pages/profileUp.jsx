import React from "react";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { formDataState, imageState, isUploadingState, tokenState, checkVarState, isSignedInState, isSignedUpState, upimageState, upformState, placeholderUsernameState, placeholderEmailState, placeholderPasswordState, checkpassState, inPassState } from "../atoms.js";
import { div } from "framer-motion/client";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../storage/useThemeStore.js";
import backend from "../backendString.js"


const ProfileUp = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <div className="relative w-full h-full flex justify-center items-center">
                <div className="absolute max-w-2xl mx-auto bg-white/30 backdrop-blur-lg backdrop-saturate-150 rounded-3xl shadow-2xl p-8 border border-white/20">
                    <h1 className="text-3xl font-extrabold text-center text-white mb-6">
                        Update Your Credentials
                    </h1>
                    <Form />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};


const Form = () => {
    const [upformData, setupFormData] = useRecoilState(upformState);
    const [upimage, setupImage] = useRecoilState(upimageState);
    const [isUploading, setIsUploading] = useRecoilState(isUploadingState);
    const navigate = useNavigate();

    const [checkVar, setCheckVar] = useRecoilState(checkVarState);
    const token = useRecoilValue(tokenState); // using token here for the middleware
    const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInState);
    const [isSignedUp, setIsSignedUp] = useRecoilState(isSignedUpState);
    const [username, setUsername] = useRecoilState(placeholderUsernameState)
    const [email, setEmail] = useRecoilState(placeholderEmailState)
    const [password, setPassword] = useRecoilState(placeholderPasswordState)
    const [checkPass, setCheckPass] = useRecoilState(checkpassState)
    const [inPass, setInPass] = useRecoilState(inPassState)

    const userpfpref = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setupFormData({
            ...upformData,
            [name]: value,
        });
    };

    const handleImageUpload = (e) => {
        setupImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        if (upimage) {
            const imageData = new FormData();
            imageData.append("file", upimage);
            imageData.append("upload_preset", "my_unsigned_preset");

            // console.log(`ImageData: ${imageData.FormData}`)

            try {
                const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/dutrfbtao/image/upload`, imageData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                if (cloudinaryResponse.data && cloudinaryResponse.data.secure_url) {
                    userpfpref.current = cloudinaryResponse.data.secure_url;
                } else {
                    throw new Error("Failed to upload image to Cloudinary");
                }
                console.log("Hi")

                const response = await axios.put(`${backend}/user/profileUp`, {
                    ...upformData,
                    userpfp: userpfpref.current,
                }, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 201) {
                    toast.success("Profile data updated successfully!", {
                        position: "bottom-right",
                        autoClose: 3000, 
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    setupFormData({
                        title: "",
                        description: "",
                        userpfp: "",
                    });
                    setupImage(null);
                    setCheckPass(false);
                }
            } catch (error) {
                console.error("Error: ", error);
                window.alert("Failed to create blog.");
            } finally {
                setIsUploading(false);
            }
        } else {
            try {
                
                const response = await axios.put(`${backend}/user/profileUp`, {
                    ...upformData,
                    userpfp: userpfpref.current,
                }, {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 201) {
                    toast.success("Profile data updated successfully!", {
                        position: "bottom-right",
                        autoClose: 3000, 
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      });
                    setupFormData({
                        title: "",
                        description: "",
                        userpfp: "",
                    });
                    setupImage(null);
                    setCheckPass(false);
                }
            } catch (error) {
                console.error("Error: ", error);
                window.alert("Failed to create blog.");
            } finally {
                setIsUploading(false);
            }

        }
    };

    function handleInPass(e){
        const { name, value } = e.target;
        setInPass({
            [name]: value
        }) 
    }

    async function handleCheckPass(e){
        setIsUploading(true)
        e.preventDefault()
        try {
            const response = await axios.post(`${backend}/user/check`, inPass,{
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data)

            if(response.status === 201){
                setCheckPass(true)
                toast.success("Verified", {
                    position: "bottom-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            } else {
                setCheckPass(false)
                toast.error("Can't Verify", {
                    position: "bottom-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            }

        } catch (error) {
            console.error(`Error: ${error}`)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div>{checkPass ?

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                        <input 
                            className="input input-ghost w-full max-w-xs"
                            onChange={handleChange} 
                            type="text" 
                            placeholder={username} 
                            name="username"
                            required
                        />
                    </div>
                    <div>
                        <input 
                            className="input input-ghost w-full max-w-xs"
                            onChange={handleChange} 
                            type="email" 
                            placeholder={email}  
                            name="email"
                            required
                        /> 
                    </div>
                    <div>
                        <input 
                            className="input input-ghost w-full max-w-xs"
                            onChange={handleChange} 
                            type="password" 
                            placeholder={password} 
                            name="password"
                            required
                        />
                    </div>
                    <div>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        required
                        name="userpfp"
                        className="input input-ghost w-full max-w-xs"
                    />
                </div>
                    <button 
                        type="submit" 
                        className="btn btn-ghost"
                    >
                    {isUploading ? "Updating..." : "Update"}   
                    </button>
            </form> : <div class="form-container">
                        <form onSubmit={handleCheckPass}>
                            <input 
                                onChange={handleInPass} 
                                type="password" 
                                name="inPass" 
                                placeholder="Enter your password"
                                required 
                                className="input input-ghost w-full max-w-xs"
                            />
                            <button className="btn btn-ghost" type="submit">Submit</button>
                        </form>
                    </div>
        } 
          
        </div>
    );
};



export default ProfileUp;