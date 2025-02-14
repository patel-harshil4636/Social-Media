import React from "react";
import { Link, useLocation } from "react-router-dom";

function RedirectBtn(props) {
  const location = useLocation();
  
  return (
    <>
      <Link to={props.path}>
        <button
          className={` flex gap-2 MainFont rounded-lg px-5 py-2 ${!props.sm ? "text-md" : "text-xl"} mx-auto block   hover:bg-teal-500  hover:text-black duration-100 ${props.className} `}
          onClick={props.onClick}
        >
          {props.title}{" "}
          
          {props.extraIcon && <i className={`${props.extraIcon} `}> </i>}

          {props.hover=='rotate' && <i className="fas fa-rotate-right text-white"></i>}
          
        </button>
      </Link>
    </>
  );
}

export default RedirectBtn;
