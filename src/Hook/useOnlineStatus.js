// src/hooks/useOnlineStatus.js
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "../firebase/config";

const useOnlineStatus = (userId) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const userStatusRef = ref(realtimeDb, `/onlineUsers/${userId}`);
    const unsubscribe = onValue(userStatusRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setIsOnline(data.isOnline);
        setLastSeen(data.lastSeen);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return { isOnline, lastSeen };
};

export default useOnlineStatus;
