// src/firebase/firebasePosts.js

import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding post:", error);
    return { success: false, error };
  }
};
