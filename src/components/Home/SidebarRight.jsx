// /src/components/SidebarRight.jsx
import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

const SidebarRight = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [visibleUsers, setVisibleUsers] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // Holds the ID of the user being followed/unfollowed

  const { currentUser } = useAuth();

  // 🔄 **Fetch Suggested Users**
  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('fullName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.id !== currentUser.userId); // Exclude the current user
      setSuggestedUsers(usersList);
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 🔄 **Follow / Unfollow Logic**
  const toggleFollow = async (userId) => {
    if (!currentUser?.userId) return;

    setActionLoading(userId);
    
    const userDocRef = doc(db, 'users', currentUser.userId);  // Reference to *current user's* doc
    const targetUserDocRef = doc(db, 'users', userId);        // Reference to *target user's* doc
    
    const isFollowing = currentUser.following?.includes(userId);

    try {
      if (isFollowing) {
        // 🔽 **Unfollow Logic**
        await updateDoc(userDocRef, {
          following: arrayRemove(userId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayRemove(currentUser.userId),
        });

        // Real-time local update (if your AuthContext doesn't auto-refresh):
        currentUser.following = currentUser.following.filter((id) => id !== userId);

      } else {
        // 🔼 **Follow Logic**
        await updateDoc(userDocRef, {
          following: arrayUnion(userId),
        });
        await updateDoc(targetUserDocRef, {
          followers: arrayUnion(currentUser.userId),
        });

        // Real-time local update (if your AuthContext doesn't auto-refresh):
        currentUser.following.push(userId);
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
    { id: 1, title: 'Five questions you should answer truthfully', time: '2h', image: '/api/placeholder/320/160' },
    { id: 2, title: 'Ten unbelievable facts about mountains', time: '2h', image: '/api/placeholder/320/160' },
  ];

  // 🔄 **UI Rendering**
  return (
    <div className="pl-2">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h3 className="font-bold text-base mb-4">Who to follow</h3>

        {loadingUsers ? (
          <div>Loading users...</div>
        ) : (
          <div className="space-y-4">
            {suggestedUsers.slice(0, visibleUsers).map((user) => {
              const isFollowing = currentUser.following?.includes(user.id);
              const isLoading = actionLoading === user.id;

              return (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                      <img
                        src={user.profilePicture || '/api/placeholder/32/32'}
                        alt={user.fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.fullName}</div>
                      <div className="text-gray-500 text-xs">@{user.username}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollow(user.id)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
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
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <div className="flex items-center mt-2">
                  <div className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-500">
                    {item.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
