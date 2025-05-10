// src/components/UserStatusUpdater.js
import { useEffect } from "react";
import { ref, set, onDisconnect, serverTimestamp } from "firebase/database";
import { realtimeDb } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

const UserStatusUpdater = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const userStatusRef = ref(realtimeDb, `/onlineUsers/${currentUser.userId}`);

      set(userStatusRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      });

      onDisconnect(userStatusRef).set({
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    }
  }, [currentUser]);

  return null;
};

export default UserStatusUpdater;
