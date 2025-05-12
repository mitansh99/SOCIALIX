import React, { useRef, useState } from "react";
import { CiMail } from "react-icons/ci";
import { PiPasswordThin } from "react-icons/pi";
import { ColoringData } from "../../StaticData";
import loadingGif from "../../assets/loading.gif";
import { loginUser } from "../../firebase/authUtils";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getDocs, collection, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "../../firebase/config";
import ToastManager from "../others/Toast";

const LoginForm = () => {
  const email = useRef();
  const password = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const validateData = ({ email }) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);
    if (!isEmailValid) setError("⚠️ Invalid email format.");
    return { emailValid: isEmailValid };
  };

  const handleLogin = async () => {
    setError("");
    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    const isValid = validateData({ email: emailValue });

    if (!isValid.emailValid || passwordValue === "") {
      setError("Enter valid Email & Password.");
      return;
    }
    try {
      setIsLoading(true);
      const q = query(collection(db, "users"), where("email", "==", emailValue));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("User not found");
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      const isPasswordCorrect = bcrypt.compareSync(passwordValue, userData.password);
    
      if (!isPasswordCorrect) {
        throw new Error("Incorrect password");
      }
        if (userData) {
          setCurrentUser(userData);
          userData.password = passwordValue;
          userData.userId = userDoc.id;
          const {userId , fullName , username , email ,password} = userData
          localStorage.setItem("userData",JSON.stringify({userId , fullName , username , email ,password}));
          window.showToast("User Login success!", "success");

          navigate("/home");
        } else {
          setError("User data not found in Firestore.");
        }
    } catch (err) {
      console.error("Login Error:", err);
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-10 relative"
      style={{ backgroundColor: ColoringData.Theme.light.baseColor }}
    >
      <ToastManager />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[2px]">
          <img src={loadingGif} alt="loading" className="w-20 sm:w-32" />
        </div>
      )}

      <div
        className={`bg-white p-5 sm:p-8 rounded-xl shadow-md w-full max-w-md ${
          isLoading ? "opacity-30" : ""
        }`}
      >
        <div className="mb-5 sm:mb-7">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Login to your account to continue your journey
          </p>
        </div>

        <Input label="Email" icon={<CiMail />} type="email" refEl={email} />
        <Input label="Password" icon={<PiPasswordThin />} type="password" refEl={password} />

        <div className="flex justify-end mb-3 sm:mb-4">
          <a href="#" className="text-xs sm:text-sm hover:underline transition"
            style={{ color: ColoringData.Theme.light.secondaryColor }}>
            Forgot password?
          </a>
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 p-2 sm:p-3 text-xs sm:text-sm my-3 sm:my-5 rounded-md">
            {error.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

        <button
          style={{ backgroundColor: ColoringData.Theme.light.primarColor }}
          className="w-full text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-xs sm:text-sm md:text-base"
          onClick={handleLogin}
        >
          Login
        </button>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium hover:underline"
              style={{ color: ColoringData.Theme.light.secondaryColor }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, icon, type = "text", refEl }) => (
  <div className="mb-3 sm:mb-4">
    <label className="block mb-1 text-xs sm:text-sm text-gray-600">{label}</label>
    <div className="flex items-center border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus-within:shadow-md">
      <span className="text-gray-400 mr-2 sm:mr-3">{icon}</span>
      <input
        type={type}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full outline-none text-xs sm:text-sm placeholder-gray-400 bg-transparent"
        ref={refEl}
      />
    </div>
  </div>
);

export default LoginForm;
