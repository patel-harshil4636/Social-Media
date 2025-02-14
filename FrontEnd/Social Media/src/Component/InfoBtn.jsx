import React from "react";

function InfoBtn(props) {
  return (
    <button
      onClick={props.onClick}
      className={`block bg-blue-600 px-5 rounded-lg text-white  ${props.className}`}
    >
      {props.title}
    </button>
  );
}

export default InfoBtn;
