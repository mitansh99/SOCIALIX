import React, { useEffect, useRef, useState } from "react";
import { CiUser, CiMail, CiPhone } from "react-icons/ci";
import { PiPasswordThin } from "react-icons/pi";
import { doc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import loadingGif from "../../assets/loading.gif";
import { ColoringData } from "../../StaticData";
import bcrypt from "bcryptjs";
import ToastManager from "../others/Toast";

const RegisterForm = () => {
  const {currentUser ,setCurrentUser} = useAuth();
  useEffect(()=>{
    if (!currentUser && location.pathname === "/auth/register") {
      navigate("/auth/register");
    }
  }, [currentUser, location]);
  const refs = {
    userEmail: useRef(""),
    userName: useRef(""),
    userPassWord: useRef(""),
    fullName: useRef(""),
    phoneNumber: useRef(""),
    bio: useRef(""),
  };

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateData = ({ email, password, phone, username }) => {
    const patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      phone: /^\d{10}$/,
      username: /^\S+$/,
    };

    const errors = [];

    if (!patterns.email.test(email)) errors.push("Invalid email format.");
    if (!patterns.password.test(password))
      errors.push(
        "Password must be at least 8 characters long with upper, lower, number, and special character."
      );
    if (!patterns.phone.test(phone)) errors.push("Phone number must be 10 digits.");
    if (!patterns.username.test(username)) errors.push("Username must not contain spaces.");

    return errors;
  };

  const clearForm = () => {
    Object.values(refs).forEach((ref) => (ref.current.value = ""));
  };

  const handleRegister = async () => {
    const values = {
      email: refs.userEmail.current.value,
      password: refs.userPassWord.current.value,
      phone: refs.phoneNumber.current.value,
      username: refs.userName.current.value,
    };

    const validationErrors = validateData(values);
    if (validationErrors.length) {
      setError(validationErrors.join("\n"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(values.password, salt);
      const userObj = {
        username: values.username,
        fullName: refs.fullName.current.value,
        email: values.email,
        phone: values.phone,
        bio: refs.bio.current.value,
        password: hashedPassword,
        followers: [],
        following: [],
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "users"), userObj);
      const docSnap = await getDoc(doc(db, "users", docRef.id));

      if (docSnap.exists()) {
        clearForm();
          navigate("/auth/login");
      } else {
        throw new Error("User document not found");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Something went wrong during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const Input = ({ label, icon, type = "text", refEl }) => (
    <div className="mb-3 md:mb-4">
      <label className="block mb-1 text-xs sm:text-sm text-gray-600">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus-within:shadow-md transition-shadow">
        <span className="text-gray-400 mr-1 sm:mr-2">{icon}</span>
        <input
          type={type}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="w-full outline-none text-xs sm:text-sm placeholder-gray-400 bg-transparent"
          ref={refEl}
        />
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-10"
      style={{ backgroundColor: ColoringData.Theme.light.baseColor }}
    >
      <ToastManager />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-10 backdrop-blur-[2px]">
          <img src={loadingGif} alt="loading" className="w-16 sm:w-20 md:w-32" />
        </div>
      )}

      <div
        className={`bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 ${
          isLoading ? "opacity-30" : ""
        }`}
      >
        <div className="col-span-1 md:col-span-2 mb-3 sm:mb-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Join the community — connect, share, and explore with people around the world.
          </p>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Input label="Username" icon={<CiUser size={18} />} refEl={refs.userName} />
          <Input label="Email" icon={<CiMail size={18} />} type="email" refEl={refs.userEmail} />
          <Input 
            label="Password" 
            icon={<PiPasswordThin size={18} />} 
            type="password" 
            refEl={refs.userPassWord} 
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Input label="Full Name" icon={<CiUser size={18} />} refEl={refs.fullName} />
          <Input label="Phone Number" icon={<CiPhone size={18} />} type="tel" refEl={refs.phoneNumber} />
          <div>
            <label className="block text-xs sm:text-sm text-gray-600 mb-1">Short Bio</label>
            <textarea
              ref={refs.bio}
              placeholder="Short bio"
              className="w-full text-xs sm:text-sm p-2 sm:p-3 border border-gray-300 rounded-md resize-none outline-none placeholder-gray-400 focus:shadow-md transition-shadow"
              rows={3}
            />
          </div>
        </div>

        {error && (
          <div className="col-span-1 md:col-span-2 text-red-600 bg-red-50 p-2 sm:p-3 text-xs sm:text-sm rounded-md whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="col-span-1 md:col-span-2 mt-2 sm:mt-3">
          <button
          type="button"
          disabled={isLoading}
            style={{ backgroundColor: ColoringData.Theme.light.primarColor }}
            className="w-full text-white py-2 md:py-3 rounded-lg font-medium hover:shadow-md text-xs sm:text-sm cursor-pointer transition-shadow"
            onClick={handleRegister}
          >
            Create Account
          </button>
        </div>

        <div className="col-span-1 md:col-span-2 mt-2 flex justify-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-medium hover:underline"
              style={{ color: ColoringData.Theme.light.secondaryColor }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;