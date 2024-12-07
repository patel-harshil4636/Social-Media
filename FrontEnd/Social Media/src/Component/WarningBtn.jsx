import React from "react";

function WarningBtn(props) {
  return (
    <>
      <button
        className={`border border-red-800 rounded-lg px-5 mx-auto block  hover:bg-red-800 hover:text-white duration-100  ${props.className}`}
        onClick={props.onClick}
      >
        {props.title}
      </button>
    </>
  );
}

export default WarningBtn;
