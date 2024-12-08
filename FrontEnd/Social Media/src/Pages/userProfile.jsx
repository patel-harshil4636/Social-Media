import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../Component/Nav";
import { Background } from "../Contexts/sm";
import js from "@eslint/js";
import { animate } from "framer-motion";
import InfoBtn from "../Component/InfoBtn";

function UserProfile() {
  const [posts, setPosts] = useState([]);
  const followBox = useRef(null);

  const { setBodyOpacity } = useContext(Background);
  const params = useParams();
  const [loading, seLoading] = useState(true);
  const [data, setData] = useState({});
  const [unFollowed, setUnFollowed] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [toggleFollowers, setToggleFollowers] = useState(false);

  const [fData, setFData] = useState({});

  useEffect(() => {
    if (params.userName) {
      console.log("the user name is " + params.userName);
      const profileFetch = async () => {
        try {
          const response = await fetch(`/user/this/${params.userName}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const jsonData = await response.json();
          if (jsonData) {
            setData(jsonData);
            seLoading(false); // Explicitly set loading to false
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          seLoading(false); // Ensure loading stops even on error
        }
      };

      profileFetch();
    }
  }, [params.userName]);

  useEffect(() => {
    const checkFollowed = async () => {
      try {
        const response = await fetch(`/api/checkFollowed/${params.userName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const rData = await response.json();
        if (rData[0]?.Following?.includes(params.userName)) {
          setFollowed(true);
        } else {
          setFollowed(false);
        }
      } catch (error) {
        console.error("Error checking followed status:", error);
      }
    };
    checkFollowed();
  }, [params.userName]);

  const handleFollow = async () => {
    setFollowed(true); // This triggers a re-render
    try {
      const response = await fetch(`/api/Follow/${params.userName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const rdata = await response.json();
      if (rdata?.followers?.includes(params.userName)) {
        setFollowed(true); // This triggers a re-render
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    setFollowed(false);
    try {
      const response = await fetch(`/api/unfollow/${params.userName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setFollowed(false); // This triggers a re-render
      } else {
        console.error("Error unfollowing user");
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    const fetchByTheparams = async () => {
      try {
        const result = await fetch("/api/ffdata/" + params.userName, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setFData((await result.json())[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchByTheparams();
  }, [followed]);

  useEffect(() => {
    if (toggleFollowers && followed) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [toggleFollowers]);

  const handleScroll = (event) => {
    console.log(event.deltaY);

    const blackBox = followBox.current;
    if (blackBox) {
      // Adjust the scroll position of the black box
      blackBox.scrollTop += event.deltaY * 0.5;
    }
  };

  return (
    <>
      {loading ? (
        <h1 className="text-center ">Loading...</h1>
      ) : (
        <>
          <Nav></Nav>
          {toggleFollowers && followed && (
            <div
              ref={followBox}
              onMouseEnter={() => {
                setToggleFollowers(true);
              }}
              onMouseLeave={() => {
                setToggleFollowers(!toggleFollowers);
              }}
              className={`absolute max-h-[400px] overflow-y-auto
  [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:rounded-md
  [&::-webkit-scrollbar-track]:bg-slate-200
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-100
  dark:[&::-webkit-scrollbar-track]:bg-neutral-900
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 
  
  z-40  overscroll-auto  scroll-smooth text-white opacity-100  w-1/6 h-1/6 bg-black sm:right-3/4    rounded-md border shadow hover:shadow-2xl duration-500  hover:shadow-blue-800  `}
            >

              <h1 className="text-center">
              <i className="bi bi-people-fill"></i>
              </h1>
              <hr />
              {fData?.followers?.map((follower) => (
                <div
                  key={follower}
                  className="flex gap-2 mx-auto   w-fit text-white"
                >
                  {follower}
                </div>
              ))}
            </div>
          )}
          <div className={`duration-500 ${toggleFollowers && followed ? "blur-sm" : ""}`}>
            <div className="border overflow-x-hidden bg-zinc-800 justify-center flex  text-gray-300  gap-5   sm:gap-32 rounded-b-3xl">
              <div className="text-gray-300 flex  justify-center gap-6 rounded-b-3xl">
                <img
                  src={new URL(data?.user?.imgAdd, import.meta.url).href}
                  style={{
                    aspectRatio: "2/2",
                  }}
                  className="w-1/4 sm:w-60 sm:h-60 h-24    rounded-full object-cover my-auto justify-items-start object-center"
                  alt=""
                />
                <div className="my-auto">
                  <div className="flex  gap-2 mx-auto  w-fit text-black">
                    <div>
                      <div className="text-sm grid text-center  cursor-pointer  hover:bg-black hover:text-white duration-200 border px-2 w-f rounded-lg  my-auto">
                        <h1 className="font-bold ">Post</h1>
                        <h1 className="font-bold ">
                          {data?.allPosts?.length ? data?.allPosts?.length : 0}
                        </h1>
                      </div>
                    </div>

                    <div
                      onWheel={handleScroll}
                      onMouseEnter={() => {
                        setToggleFollowers(!toggleFollowers);
                      }}
                      onMouseLeave={() => {
                        setToggleFollowers(!toggleFollowers);
                      }}
                      className="text-sm grid text-center  cursor-pointer  hover:bg-black hover:text-white duration-200 border px-2 w-f rounded-lg  my-auto"
                    >
                      <h1 className="font-bold ">Followes</h1>
                      <h1 className="font-bold ">
                        {fData?.followers?.length
                          ? fData?.followers?.length
                          : 0}
                      </h1>
                    </div>
                    <div className="text-sm grid text-center border px-2 rounded-lg  hover:bg-black hover:text-white duration-200  cursor-pointer  my-auto">
                      <h1 className="font-bold ">Following</h1>
                      <h1 className="font-bold ">
                        {fData?.Following?.length
                          ? fData?.Following?.length
                          : 0}
                      </h1>
                    </div>
                  </div>
                  <h1 className="font-bold sm:text-2xl my-1">
                    User Name: {data?.user?.userName}
                  </h1>
                  <h1 className="font-bold sm:text-2xl">
                    {data?.user?.Fname} {data?.user?.Lname}
                  </h1>
                  <h3 className="sm:text-xl font-bold">
                    Email : {data?.user?.email}
                  </h3>
                  <div className="my-1">
                    {followed ? (
                      <>
                        <div className="flex justify-evenly">
                          <button
                            onClick={handleUnfollow}
                            className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded-full"
                          >
                            Unfollow
                          </button>
                          <button className="border text-white font-bold py-2 px-4 rounded-full">
                            Massage
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <InfoBtn
                          title="Follow"
                          onClick={handleFollow}
                          className="sm:text-xl"
                        ></InfoBtn>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {followed && (
              <div className="border bg-slate-950 pb-12  text-white rounded-lg">
                <div className="flex ">
                  <h2 className="text-xl text-center  w-full mx-auto  font-bold my-auto">
                    Your Posts
                  </h2>
                </div>
                <div className="flex  flex-wrap  gap-4 p-3 justify-center w-fit sm:w-5/6 mx-auto">
                  {data.allPosts.map((post, index) => (
                    <div
                      key={index}
                      className="bg-slate-100 rounded-tl-none  rounded-xl"
                    >
                      <h1 className="text-black ms-2 font-thin">
                        {data?.user?.userName}
                      </h1>
                      <img
                        className="w-fit sm:h-80 h-52   object-cover  object-center mx-auto rounded-b-xl  "
                        src={new URL(post.url, import.meta.url).href}
                        alt="a"
                        style={{
                          aspectRatio: "4/5",
                        }}
                      />
                      <div className="ms-2 flex gap-2">
                        <i className="bi bi-heart-fill text-pink-700 text-xl"></i>
                        <i className="bi bi-chat  text-xl text-black"></i>
                      </div>
                      <h2 className="text-black ms-2">
                        Caption: {post.caption}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default UserProfile;
