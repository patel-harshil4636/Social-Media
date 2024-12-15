import React from "react";
import { Link } from "react-router-dom";

function RedirectBtn(props) {
  return (
    <>
      <Link to={props.path}>
        <button
          className={`  flex gap-2 MainFont rounded-lg px-5 py-2 ${!props.sm ? "text-md" : "text-xl"} mx-auto block  hover:bg-slate-600 hover:text-white duration-100 ${props.className} `}
          onClick={props.onClick}
        >
          {props.title}{" "}
          {props.extraIcon && <i className={props.extraIcon}> </i>}
        </button>
      </Link>
    </>
  );
}

export default RedirectBtn;
