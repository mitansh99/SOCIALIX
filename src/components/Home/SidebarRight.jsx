// /src/components/SidebarRight.jsx
const SidebarRight = () => {
    const suggestedUsers = [
      { name: 'Scarlett Floyd', username: 'floydscrt' },
      { name: 'Rohan Mckenzie', username: 'rohanmk' },
      { name: 'Bibi Shelton', username: 'bibi' },
      { name: 'Beatrice Cox', username: 'coxbeat' },
      { name: 'Fletcher Morse', username: 'fletchmm' }
    ];
    
    const news = [
      {
        id: 1,
        title: 'Five questions you should answer truthfully',
        time: '2h',
        image: '/api/placeholder/320/160'
      },
      {
        id: 2,
        title: 'Ten unbelievable facts about mountains',
        time: '2h',
        image: '/api/placeholder/320/160'
      }
    ];
  
    return (
      <div className="pl-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h3 className="font-bold text-base mb-4">Who to follow</h3>
          
          <div className="space-y-4">
            {suggestedUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                    <img 
                      src="/api/placeholder/32/32" 
                      alt={user.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-gray-500 text-xs">@{user.username}</div>
                  </div>
                </div>
                
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200">
                  Follow
                </button>
              </div>
            ))}
          </div>
          
          <button className="text-blue-500 text-sm font-medium mt-4 w-full text-center pt-2 border-t border-gray-100">
            View more
          </button>
        </div>
        
        <div>
          <h3 className="font-bold text-base mb-4">Today's news</h3>
          
          <div className="space-y-4">
            {news.map(item => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
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