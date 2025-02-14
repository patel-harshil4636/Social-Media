import React, { createContext, useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
export const Background = createContext(null);

export const Provider = (props) => {
  const [data, setData] = useState(null); // its give the current logined user Information{userName,etc}
  const [searchData, setSearchData] = useState(null);
  const [test, setTest] = useState(null);
  const [sm, setSm] = useState(false);
  const [allUserPicture, setAllUserPicture] = useState([]);
  const [userName, setUserNames] = useState([]);
  const [rander, setRander] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [profileFData, setProfileFData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [notification, setNotification] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await fetch("http://localhost:8000/user/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const jsonData = await response.json();
      setCurrentUser(jsonData[0]);
    };
    fetchCurrentUser();
  }, []);

  const socket = io("http://localhost:8000");

  const x = window.matchMedia("(min-width:640px)");
  useEffect(() => {
    const getUser = async () => {
      // Make a request to your API here

      const response = await fetch("/user/AllUsers", {
        mathod: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await response.json();
      // console.log(jsonData);
      const allPicture = jsonData.map((j) => j.imgAdd);
      setAllUserPicture(allPicture);
      const names = jsonData.map((user) => user.userName); // mapping is the method to the get array.....
      setUserNames(jsonData);
    };
    getUser();
  }, [searchTerm, filteredUsers]);

  useEffect(() => {
    const ffFetcher = async () => {
      try {
        const response = await fetch("/api/ffdata", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const ffData = await response.json();
        // console.log(ffData.following.map(following=>following.Following));

        setProfileFData((profileFData) => ({
          ...profileFData,
          following: ffData.following
            .map((following) => following.Following)
            .filter(Boolean)
            .flat(),
          followers: ffData.followers
            .map((following) => following.followers)
            .filter(Boolean)
            .flat(),
        }));
      } catch (error) {
        console.error("Error fetching follower data:", error);
      }
    };

    ffFetcher();
  }, [rander]);

  useEffect(() => {
    async function fetchData() {
      const resposnse = await fetch("user/api", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const datas = await resposnse.json();
      setData(datas[0]);
      // console.log(datas[0]);

      socket.emit("join", datas[0]?.userName);
      socket.on("newNotification", (notification) => {
        console.log("New Notification:", notification);
        alert(`You have a new notification: ${notification.type}`);
      });
    }
    fetchData();
  }, [isProfileUpdated]);

  x.addEventListener("change", () => {
    if (x.matches) {
      // If media query matches
      setSm(true);
    } else {
      setSm(false);
    }
  });
  useEffect(() => {
    if (x.matches) {
      // If media query matches
      setSm(true);
    } else {
      setSm(false);
    }
  }, []);

  // for the Search list photo and UserNames
  useEffect(() => {
    const allUserSearchListData = async () => {
      const response = await fetch("user/SearchList/Data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response);

      const resluts = await response.json();
      // console.log(resluts);
      setSearchData(resluts);
    };
    allUserSearchListData();
  }, []);

  const [updatedFileToggle, setUpdatedFileToggle] = useState();

  // u

  return (
    <Background.Provider
      value={{
        sm,
        data,
        searchData,
        isProfileUpdated,
        setIsProfileUpdated,
        profileFData,
        allUserPicture,
        userName,
        rander,
        setRander,
        searchTerm,
        setSearchTerm,
        filteredUsers,
        notification,
        setNotification,
        setFilteredUsers,
        currentUser,
      }}
    >
      {props.children}
    </Background.Provider>
  );
};
