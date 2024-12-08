import React, { useRef } from "react";

const ScrollSync = () => {
  const blackBoxRef = useRef(null);

  const handleScroll = (event) => {
    const blackBox = blackBoxRef.current;
    if (blackBox) {
      // Adjust the scroll position of the black box
      blackBox.scrollTop += event.deltaY;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Black Box */}
      <div
        ref={blackBoxRef}
        style={{
          width: "300px",
          height: "200px",
          backgroundColor: "black",
          overflowY: "scroll",
          color: "white",
          padding: "10px",
        }}
      >
        {/* Content for the Black Box */}
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>Black Box Content {i + 1}</p>
        ))}
      </div>

      {/* Followers Button */}
      <button
        onWheel={handleScroll}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Followers
      </button>
    </div>
  );
};

export default ScrollSync;
