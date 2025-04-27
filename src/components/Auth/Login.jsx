import React, { useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { CiMail } from "react-icons/ci";
import { PiPasswordThin } from "react-icons/pi";
import { ColoringData } from "../../StaticData";
import loadingGif from "../../assets/loading.gif";
import { loginUser, signInWithGoogle } from "../../firebase/authUtils";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const email = useRef();
  const password = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useAuth(); 
   const navigate = useNavigate();

  const HandelLoginBtn = async () => {
    try {
      const isValidate = validateData({
        email: email.current.value,
      });
      let data;
      if (isValidate.emailValid && password.current.value != "") {
        setIsLoading(true);
        // calling the Auth Function to Validate user
        data = await loginUser(
          email.current.value,
          password.current.value
        );

        if (data.user) {
          setError(""); 
          setCurrentUser(data.user);
          navigate("/home"); 
        } else {
          setError(data.error); // show the specific error
        }
        setIsLoading(false);
      }
      else{
        setError("Enter Email & Password.")
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Internal Server Error !");
      setIsLoading(false);
    }
  };

const handleGoogleLogin = async () => {
  const data = await signInWithGoogle();

  if (data.user) {
    setCurrentUser(data.user); // save globally
    navigate("/home");
  } else {
    setError(data.error);
  }
};

  const validateData = (Data) => {
    const { email } = Data;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);

    let message = "";
    if (!isEmailValid) message += "⚠️ Invalid email format.\n";

    setError(message);

    return {
      emailValid: isEmailValid,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
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
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Email</label>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
            <span className="text-gray-400 mr-2">
              <CiMail />
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full outline-none text-sm placeholder-gray-300"
              autoComplete="false"
              spellCheck="false"
              ref={email}
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
              placeholder="Enter your password"
              className="w-full outline-none text-sm placeholder-gray-300"
              ref={password}
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

        {/* Login Button */}
        <button
          style={{ backgroundColor: ColoringData.Theme.light.primarColor }}
          className="cursor-pointer w-full  text-white py-2 rounded-md font-semibold hover:shadow-md transition mb-2"
          onClick={HandelLoginBtn}
        >
          Login
        </button>

        <div className="text-center text-gray-400 mb-2">or</div>

        {/* Google Login Button */}
        <button className="cursor-pointer w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-3 hover:shadow-md transition" onClick={handleGoogleLogin}>
          <FcGoogle />
          <span className="text-gray-700 font-medium">Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
