import React, { useRef, useState } from "react";

const Test = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [brightness, setBrightness] = useState(100); // Default brightness
  const followerRef = useRef(null);
  const listRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleScroll = () => {
    if (followerRef.current && listRef.current) {
      listRef.current.scrollTop = followerRef.current.scrollTop;
    }
  };

  const handleFollowClick = (username) => {
    if (brightness === 100) {
      // Redirect or perform action based on username
      alert(`Redirecting to ${username}'s profile!`);
      // Example redirection (replace with your logic)
      window.location.href = `/profile/${username}`;
    }
  };

  const usernames = ["user1", "user2", "user3", "user4", "user5"];

  return (
    <div
      ref={followerRef}
      className="relative h-40 w-80 overflow-auto bg-gray-200 p-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onScroll={handleScroll}
    >
      <div className="text-gray-700">Followers Component</div>

      {isHovered && (
        <div
          ref={listRef}
          className={`absolute   h-40 w-full bg-white transition-all duration-300 ${
            brightness === 100 ? "brightness-100" : "brightness-75"
          } overflow-auto p-4`}
        >
          <ul className="space-y-2">
            {usernames.map((username, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                <span className="text-gray-800">{username}</span>
                <button
                  className="px-4 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => handleFollowClick(username)}
                >
                  Follow
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Test;
