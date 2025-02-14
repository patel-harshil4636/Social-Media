import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Nav from "./Component/Nav";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import LogOut from "./Pages/LogOut";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import UserSearch from "./Pages/Search";
import UserProfile from "./Pages/userProfile";
import Notification from "./Component/Notification";
import { Background } from "./Contexts/sm";
import { io } from "socket.io-client";
import "./App.css";
// import VerifyOTP from "./Pages/Register"; "./Pages/Register";

import { ToastContainer, toast } from "react-toastify";
import ExpensiveComponent from "./Pages/text";
import OTPVerification from "./Pages/Register";

// Initialize Socket.IO client
const socket = io("http://localhost:8000");

function App() {
  const navigate = useNavigate();

  const { notification, setNotification } = useContext(Background);

  useEffect(() => {
    if (!document.cookie.split("token=")[1] || !document.cookie) {
      navigate("/signup");
    }
  }, []);
  useEffect(() => {
    socket.on("newNotification", (notification) => {
      toast.success("hellow", {
        position: toast?.POSITION?.TOP_RIGHT,
        autoClose: 500,
      });
    });
  });
  const sendMessage = () => {
    toast.success("hellow", {
      position: toast?.POSITION?.TOP_RIGHT,
      autoClose: 500,
    });
    // Emit a message to the server
    socket.emit("msg", "Hello Dost!");
  };

  return (
    <>
    <div></div>
    <div className="bg-[#E9EDC9] min-h-screen">
      <button
        onClick={sendMessage}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        Send Test Message
      </button>
      <ToastContainer />
      <Routes>
        <Route path="/notifications" element={<Notification />} />
        <Route path="/" element={<Home />} />

        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route
          path="/register"
          element={
            <>
              <OTPVerification></OTPVerification>
            </>
          }
        />

        <Route path="/Search" element={<UserSearch />} />
        <Route path="/test" element={<ExpensiveComponent />} />

        <Route path="/Search/user/:userName" element={<UserProfile />} />
      </Routes>
      {notification && (
        <div className="absolute z-50 top-14 w-full">
          <Notification />
        </div>
      )}
    </div>
    </>
  );
}

export default App;
