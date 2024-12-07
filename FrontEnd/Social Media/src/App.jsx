import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Nav from "./Component/Nav";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import LogOut from "./Pages/LogOut";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import UserSearch from "./Pages/Search";
import UserProfile from "./Pages/userProfile";
import { fetchData } from "./Services/api";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.cookie.split("token=")[1] || !document.cookie) {
      navigate("/signup");
      // return
    }
  }, []);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData("endpoint");
        console.log(data);
      } catch (error) {
        console.error("API Error:", error.message);
      }
    };
    loadData();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
        </Route>
        <Route path="/SignUp" element={<SignUp />}>

        </Route>
        <Route path="/logout" element={<LogOut />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/Search" element={<UserSearch />}></Route>
        <Route path="/Search/user/:userName" element={<UserProfile />}></Route>
      </Routes>
    </>
  );
}

export default App;
