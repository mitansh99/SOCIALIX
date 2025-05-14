import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { ref, onValue } from "firebase/database";
import { db, realtimeDb } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

const SidebarRight = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [visibleUsers, setVisibleUsers] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState({});
  const { currentUser } = useAuth();

  // 🔄 **Fetch Suggested Users**
  useEffect(() => {
    if (!currentUser?.userId) return;

    const q = query(collection(db, 'users'), orderBy('fullName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (user) =>
            user.id !== currentUser.userId &&  !currentUser.following?.includes(user.id)

        );

      setSuggestedUsers(usersList);
      setLoadingUsers(false);

      // 🟢 Fetch online status for each user
      usersList.forEach((user) => {
        const userStatusRef = ref(realtimeDb, `/onlineUsers/${user.id}`);
        onValue(userStatusRef, (snapshot) => {
          if (snapshot.exists()) {
            setOnlineStatus((prev) => ({
              ...prev,
              [user.id]: snapshot.val().isOnline,
            }));
          }
        });
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 🔄 **Listen for Changes in Firestore**
  useEffect(() => {
    if (!currentUser?.userId) return;

    const userDocRef = doc(db, "users", currentUser.userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        currentUser.following = doc.data().following || [];
        setSuggestedUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            isFollowing: currentUser.following.includes(user.id),
          }))
        );
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 🔄 **Follow / Unfollow Logic**
  const toggleFollow = async (userId) => {
    if (!currentUser?.userId) return;

    setActionLoading(userId);

    const userDocRef = doc(db, 'users', currentUser.userId);
    const targetUserDocRef = doc(db, 'users', userId);

    const isFollowing = currentUser.following.includes(userId);

    try {
      if (isFollowing) {
        await updateDoc(userDocRef, {
          following: arrayRemove(userId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayRemove(currentUser.userId),
        });
      } else {
        await updateDoc(userDocRef, {
          following: arrayUnion(userId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayUnion(currentUser.userId),
        });
      }
    } catch (err) {
      console.error('Follow/Unfollow operation failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // 🔄 **Toggle View More / Less**
  const handleToggleView = () => {
    setVisibleUsers((prev) =>
      isExpanded ? 5 : Math.min(prev + 5, suggestedUsers.length)
    );
    setIsExpanded(!isExpanded);
  };

  // 🔄 **Dummy News Data**
  const news = [
    {
      id: 1,
      title: 'Five questions you should answer truthfully',
      time: '2h',
      image: '/api/placeholder/320/160',
    },
    {
      id: 2,
      title: 'Ten unbelievable facts about mountains',
      time: '2h',
      image: '/api/placeholder/320/160',
    },
  ];

  // 🔄 **UI Rendering**
  return (
    <div className="pl-2">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="font-bold text-base mb-4">Who to follow</h3>

        {loadingUsers ? (
          <div className='text-xs '>Loading users...</div>
        ) : (
          <div className="space-y-4">
            {suggestedUsers.slice(0, visibleUsers).map((user) => {
              const isFollowing = currentUser.following.includes(user.id);
              const isLoading = actionLoading === user.id;
              const isOnline = onlineStatus[user.id] ?? false;
              const profileInitial = user.username.charAt(0).toUpperCase();

              return (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gray-300 text-gray-600 flex justify-center items-center font-semibold text-lg">
                        {profileInitial}
                      </div>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.fullName}</div>
                      <div className="text-gray-500 text-xs">@{user.username}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(user.id)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isLoading
                        ? 'bg-gray-200 text-gray-500 cursor-wait'
                        : isFollowing
                        ? 'bg-[#0a0147] text-white hover:bg-[#0a0147]'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {isLoading
                      ? isFollowing
                        ? 'Unfollowing...'
                        : 'Following...'
                      : isFollowing
                      ? 'Following'
                      : 'Follow'}
                  </button>
                </div>
              );
            })}
            {!suggestedUsers.length > 0 && (<div className='text-center text-xs text-gray-400'>No User Found</div>)}
          </div>
        )}

        {suggestedUsers.length > 5 && (
          <button
            onClick={handleToggleView}
            className="text-blue-500 text-sm font-medium mt-4 w-full text-center pt-2 border-t border-gray-100"
          >
            {isExpanded ? 'Show Less' : 'View More'}
          </button>
        )}
      </div>

      <div>
        <h3 className="font-bold text-base mb-4">Today's news</h3>
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <div className="text-xs text-gray-500">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
