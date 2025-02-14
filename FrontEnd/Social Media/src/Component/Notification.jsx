import { motion } from "framer-motion";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Background } from "../Contexts/sm";
import WarningBtn from "./WarningBtn";
import InfoBtn from "./InfoBtn";

function Notification() {
  const [allNotification, setAllNotification] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const navigate = useNavigate();
  const { notification, setNotficaiton, data } = useContext(Background);
  const [accepted, setAccepted] = useState(false);
  const notificationRef=useRef(null)
  useEffect(() => {
    console.log(data);

    const allUsersData = async () => {
      const response = await fetch("http://localhost:8000/user/allUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);
      setAllUserData(data);
    };
    allUsersData();
  }, []);
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(
        "http://localhost:8000/notify/allNotification",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      const data = await response.json();
      setAllNotification(data);
    };
    fetchNotifications();
  }, [accepted]);

  const handleReject = (userName, from) => {
    alert(`Rejecting ${from} `);
  };

  const handleAccpet = async (userName, from) => {
    const response = await fetch("http://localhost:8000/api/addfollower", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userName, from: from }),
      credentials: "include",
    });
    const rdata = await response.json();
    console.log(rdata);
    setAccepted(!accepted);
  };

  return (
    <motion.div
    
    initial={{
      opacity:0,
      height:10,
    }}
    animate={{
        height:allNotification.length==0?'fit-content':allNotification.length>=2?allNotification.length*50:200,

      opacity:1
    }}
    ref={notificationRef}

  className="text-white fixed text-center p-1 w-2/6 left-52  bg-black top-0.5 rounded-2xl overflow-y-scroll h-48 rounded-t-none "
    >
<h1 className="text-2xl border-b bg-gray-100  text-gray-950 rounded-tl-xl rounded-br-xl   ">
    Notifications
  </h1>
      <div className="flex justify-center items-center   ">
        <ul className="grid gap-3">
          {
            allNotification.length == 0 ?
              (<>
              
              <h1>
                    No More Notifications
                </h1></>)
              :(<></>)
          }
          {allNotification.map((notify, notifyIndex) => {
            const user = allUserData.find(
              (data) => data.userName === notify.from,
            );
            if (user) {
              return (
                <li key={notifyIndex} className="flex gap-3 w ">
                  <img
                    src={new URL(user.imgAdd, import.meta.url).href}
                    onClick={() => {
                      navigate("/search/user/" + user.userName);
                    }}
                    className="rounded-full w-1/6 "
                    style={{
                      aspectRatio: "3/3",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    alt=""
                  />
                  <h4 className="font-semibold  my-auto">
                    <Link
                      onClick={() => {
                        setNotficaiton(!notification);
                      }}
                      to={"/search/user/" + user.userName}
                    >
                      @{notify.message}
                    </Link>
                    <br />
                    {new Date(notify.createdAt).toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h4>
                  {notify.type == "FOLLOW" && notify.status == "pending" && (
                    <>
                      <div className="ms-auto my-auto flex gap-4 mx-3">
                        <InfoBtn
                          title="accept"
                          onClick={() => {
                            handleAccpet(notify.userName, notify.from);
                          }}
                        ></InfoBtn>
                        <WarningBtn
                          onClick={() => {
                            handleReject(notify.userName, notify.from);
                          }}
                          title={<i className="bi bi-x-lg"></i>}
                        ></WarningBtn>
                      </div>
                    </>
                  )}
                  {notify.type == "FOLLOW" && notify.status == "accepted" && (
                    <>
                      <h1 className="my-auto ms-auto me-10">FOLLOWED</h1>
                    </>
                  )}
                </li>
              );
            }
            return null; // If no matching user is found, render nothing
          })}
        </ul>
      </div>
    </motion.div>
  );
}

export default Notification;


