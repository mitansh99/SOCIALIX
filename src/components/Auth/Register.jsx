import React, { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { CiUser, CiMail } from "react-icons/ci";
import { PiPasswordThin } from "react-icons/pi";
import { registerUser, signInWithGoogle } from "../../firebase/authUtils";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import loadingGif from "../../assets/loading.gif";
import { ColoringData } from "../../StaticData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = () => {
  const userEmail = useRef("");
  const userName = useRef("");
  const userPassWord = useRef("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setCurrentUser } = useAuth(); 

  const HandelRegisterBtn = async () => {
    try {
      const isValidate = validateData({
        email: userEmail.current.value,
        name: userName.current.value,
        password: userPassWord.current.value,
      });
      let data;
      console.log(isValidate)
      if (
        isValidate.emailValid &&
        isValidate.passwordValid &&
        userName.current.value != ""
      ) {
        setIsLoading(true);
        // calling the Auth Function to create new user
        data = await registerUser(
          userEmail.current.value,
          userPassWord.current.value
        );

        if (data.user) {
          setError("");
          //  Store extra user info in database
          await setDoc(doc(db, "users", data.user.uid), {
            username: userName.current.value,
            email: data.user.email,
            createdAt: new Date(),
          });
          setIsLoading(false);
          clearForm();
          setCurrentUser(data.user);
          navigate("/home");
        } else {
          setError(data.error);
          setIsLoading(false);
        }
      } else {
        console.log("all fields require");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Internal Server Error !");
      setIsLoading(false);
    }
  };

  //Register with google
  const HandelGoogleBtn = async () => {
    try {
      //calling the Auth Function to create new user
      let data = await signInWithGoogle();
      if (data) {
        clearForm();
      }
    } catch {}
  };

  const validateData = (Data) => {
    const { email, password } = Data;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation rules:
    // - At least 8 characters
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = passwordPattern.test(password);
    let message = "";
    if (!isEmailValid) message += "⚠️ Invalid email format.\n";
    if (!isPasswordValid)
      message +=
        "⚠️ Password must be at least 8 characters, with uppercase, lowercase, number, and special character.\n";

    setError(message);

    return {
      emailValid: isEmailValid,
      passwordValid: isPasswordValid,
    };
  };

  const clearForm = () => {
    // clearing the Form Data
    userEmail.current.value = "";
    userName.current.value = "";
    userPassWord.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative ">
      {isLoading ? (
        <div className="w-40 h-40 rounded-full absolute flex items-center justify-center">
          {" "}
          <img src={loadingGif} alt="loading" />
        </div>
      ) : (
        ""
      )}
      <div
        className={`bg-white p-8 rounded-xl shadow-md w-full max-w-md ${
          isLoading ? "opacity-25" : ""
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Full Name</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <span className="text-gray-400 mr-2">
              <CiUser />
            </span>
            <input
              type="text"
              placeholder="Your name"
              className="w-full outline-none text-sm placeholder-gray-300"
              spellCheck="false"
              autoComplete="false"
              ref={userName}
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <span className="text-gray-400 mr-2">
              <CiMail />
            </span>
            <input
              type="email"
              placeholder="Your email"
              className="w-full outline-none text-sm placeholder-gray-300"
              spellCheck="false"
              autoComplete="false"
              ref={userEmail}
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Password</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <span className="text-gray-400 mr-2">
              <PiPasswordThin />
            </span>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full outline-none text-sm placeholder-gray-300"
              ref={userPassWord}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 text-sm my-5 rounded-md">
            {error.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}

        {/* Register Button */}

        <button
          style={{ backgroundColor: ColoringData.Theme.light.primarColor }}
          className={`cursor-pointer w-full text-white py-2 rounded-md font-medium hover:shadow-md transition mb-2`}
          onClick={HandelRegisterBtn}
        >
          Register
        </button>

        <div className="text-center text-gray-400 mb-2">or</div>

        {/* Google Sign Up Button */}
        <button
          className="cursor-pointer w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-3 hover:shadow-md transition "
          onClick={HandelGoogleBtn}
        >
          <FcGoogle />
          <span className="text-gray-700 font-medium">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
