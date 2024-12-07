import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchData, logOutUser } from "../Services/Fetch";

function LogOut() {
  useEffect(() => {
    const a = async () => {
      const Jdata = await logOutUser();
      if (Jdata) {
        window.location.reload();
      }
    };
    a();
  });
  return (
    <>
      <h1>Logged out successfully! Redirecting to Home page...</h1>
      <Navigate to="/" />
    </>
  );
}

export default LogOut;
