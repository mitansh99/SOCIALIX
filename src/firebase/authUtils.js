// src/firebase/authUtils.js
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./config";

const provider = new GoogleAuthProvider();

//Register User
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    let errorMessage = "Registration failed. Please try again.";
    
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email is already in use! 📧";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak! 🔒 (Minimum 6 characters)";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address format! 📧";
    }

    return { user: null, error: errorMessage };
  }
};


//Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    let errorMessage = "Login failed. Please try again.";
    if (error.code === "auth/wrong-password") {
      errorMessage = "Wrong password! ❌";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "User not found! 🔍";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address! 📧";
    }
    return { user: null, error: errorMessage };
  }
};

//SignIn With Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return { user, error: null };
  } catch (error) {
    let errorMessage = "Google sign-in failed!";

    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Popup closed before sign-in! 😕";
    }

    return { user: null, error: errorMessage };
  }
};

