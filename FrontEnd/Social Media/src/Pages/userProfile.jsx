import React, { useContext, useEffect, useState } from "react";
import Nav from "../Component/Nav";
import Post from "../Component/Post";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Background } from "../Contexts/sm";

function userProfile() {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isPendding, setIsPendding] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  // const [userFollowsDetails,setUserFollowsDetails]=useState([]);
  const { sm } = useContext(Background);
  const [userPost, setUserPost] = useState([]);
  const [showMenu, setShowMenu] = useState({
    show: false,
    who: "",
  });
  const [FFProfilePic, setFFProfilePic] = useState([]);
  const navigate = useNavigate();

  const params = useParams();

  // console.log(params);

  useEffect(() => {
    const getUserDetails = async () => {
      const resFFData = await fetch(
        "http://localhost:8000/api/ffdata/" + params.userName,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const res = await fetch(
        "http://localhost:8000/user/this/" + params.userName,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const FFdata = await resFFData.json();
      setUserFollowers(FFdata?.followersProfile);
      setUserFollowing(FFdata?.followingProfile);
      setFFProfilePic(FFdata?.mergedData);
      const data = await res.json();
      setUserPost(data?.allPosts);

      setUserDetails(await data.user);
    };
    getUserDetails();

    return async () => {
      const resCheckedProfile = await fetch(
        "http://localhost:8000/notify/checkedprofile/" + params.userName,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    };
  }, []);
  // console.log("all Profile Picture ", FFProfilePic)

  const checkPendding = async () => {
    const resCheckPendding = await fetch(
      "http://localhost:8000/api/notifications/" + params.userName,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const result = await resCheckPendding.json();
    if (result?.userName === params.userName && result?.status == "pending") {
      setIsPendding(true);
      console.log("Pending status set to true");
    } else {
      setIsPendding(false);
      console.log("Pending status remains false");
    }
  };

  useEffect(() => {
    const fetchFFData = async () => {
      // console.log('http://localhost:8000/api/checkFollowed/'+params.userName);

      const res = await fetch(
        "http://localhost:8000/api/checkFollowed/" + params.userName,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      // console.log(data);
      if (data.length > 0) {
        setIsFollowed(true);
      }
    };
    fetchFFData();

    checkPendding();
  }, [isFollowed, isPendding]);

  // ShowMenu followers Manu Showing Method
  const handleShowMenu = (a) => {
    console.log("a", a);

    a == "followers"
      ? setShowMenu({ show: true, who: "followers" })
      : setShowMenu({ show: true, who: "followings" });
  };

  console.log(showMenu);

  // handleHiddenMenu
  const handleHiddenMenu = () => {
    setShowMenu({ show: false });
  };

  // handle The Following Criteria
  const handelFollow = async () => {
    await checkPendding(); // Ensure this completes
    const FollowRes = await fetch(
      "http://localhost:8000/api/follow/" + params.userName,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    if (FollowRes.ok) {
      setIsFollowed(true); // Update state to reflect the follow action
    }
  };

  // to UnFollow The User
  const handleUnFollow = async () => {
    const unFollowRes = await fetch(
      "http://localhost:8000/api/unfollow/" + params.userName,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    if (res) {
      setIsFollowed(false);
    }
  };

  console.log(userPost);

  return (
    <>
      <Nav></Nav>
      <main className="h-svh MainFont">
        <div className="sm:w-2/5 w-full text-white grid gap-4 bg-black p-1 mx-auto rounded-b-xl">
          {showMenu.show &&
          userFollowers?.length >= 0 &&
          userFollowing?.length >= 0 ? (
            <motion.div
              animate={{
                opacity: [0, 1],
                // x:[-50,0],
                y: [-40, 10, 0],
                transition: {
                  bounce: 100,
                  damping: 5,
                  type: "spring",

                  duration: 0.5,
                },
              }}
              exit={{
                opacity: [1, 0],
                y: [0, -50],
                transition: {
                  duration: 1,
                },
              }}
              onMouseEnter={() => {
                handleShowMenu(showMenu.who);
              }}
              onMouseLeave={handleHiddenMenu}
              className="h-52  scroll-smooth overflow-y-scroll"
            >
              <ul className="grid gap-2">
                {showMenu.who == "followers" ? (
                  userFollowers?.length == 0 ? (
                    <>
                      <h1 className="mx-auto text-5xl my-20">
                        No Followers yet
                      </h1>
                    </>
                  ) : (
                    userFollowers?.map((user, index) => (
                      <>
                        <li
                          onClick={() => {
                            navigate(`/search/user/${user.userName}`);
                            window.location.reload();
                          }}
                          key={index}
                          className="flex cursor-pointer hover:bg-gray-700 hover:text-black duration-200 w-fit mx-auto rounded-xl p-3 justify-center gap-4  "
                        >
                          <img
                            src={
                              new URL(user.profilePicture, import.meta.url).href
                            }
                            className="rounded-full object-cover w-2/12"
                            style={{
                              aspectRatio: "2/2",
                            }}
                            alt=""
                          />
                          <div className="my-auto">
                            <h1 className="text-center gap-2 flex">
                              <span>
                                <i className="bi bi-person-square"></i>
                              </span>
                              {user.userName}
                            </h1>
                            <h2>Hey Let's Dream With me</h2>
                          </div>
                        </li>
                      </>
                    ))
                  )
                ) : userFollowing.length == 0 ? (
                  <>
                    <h1 className="mx-auto text-5xl my-20">No Following yet</h1>
                  </>
                ) : (
                  userFollowing?.map((user, index) => (
                    <>
                      <li
                        onClick={() => {
                          navigate(`/search/user/${user.userName}`);
                          window.location.reload();
                        }}
                        key={index}
                        className="flex cursor-pointer   hover:bg-white hover:text-black duration-200 w-fit mx-auto rounded-xl p-3 justify-center gap-4  "
                      >
                        <img
                          src={
                            new URL(user.profilePicture, import.meta.url).href
                          }
                          className="rounded-full object-center  w-2/12"
                          style={{
                            aspectRatio: "2/2",
                          }}
                          alt=""
                        />
                        <div className="my-auto">
                          <h1 className="text-center gap-2 flex">
                            <span>
                              <i className="bi bi-person-square"></i>
                            </span>
                            {user.userName}
                          </h1>
                          <h2>Hey Let's Dream With me</h2>
                        </div>
                      </li>
                    </>
                  ))
                )}
              </ul>
            </motion.div>
          ) : (
            <>
              <motion.div
                animate={{
                  opacity: [0, 0.5, 1],
                  y: 0,
                }}
                className="justify-evenly  flex sm:gap-10"
              >
                <motion.img
                  initial={{
                    x: 0,
                    scale: 1,
                  }}
                  animate={
                    sm
                      ? {
                          scale: [0.5, 1],
                          x: [-100, 0],
                          y: [-50, 50, 20, 0],
                        }
                      : null
                  }
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                  }}
                  src={new URL(userDetails?.imgAdd, import.meta.url).href}
                  className={`rounded-full relative sm:bottom-5 object-cover object-center shadow-xl  shadow-purple-600  ${!sm ? "w-1/5 my-auto h-2/2" : "w-2/6  "}`}
                  style={{
                    aspectRatio: "2/2",
                  }}
                  alt=""
                />

                <div className="my-auto sm:gap-8 grid sm:text-base  text-sm">
                  <div className="">
                    <h1
                      className={
                        " sm:text-xl text-sm flex gap-3 justify-center"
                      }
                    >
                      <span>
                        <i className="bi bi-person-square"></i>
                      </span>
                      {userDetails?.userName}
                    </h1>
                  </div>
                  <div className="flex sm:gap-12 gap-5 h-fit my-auto">
                    <div className="   grid text-center">
                      <h1>Post</h1>
                      <h2>{userPost?.length}</h2>
                    </div>
                    <div
                      onMouseLeave={handleHiddenMenu}
                      onMouseEnter={() => {
                        handleShowMenu("followers");
                      }}
                      className="grid text-center border   border-black hover:border-white p-1 rounded-xl"
                    >
                      <h1>Followers</h1>
                      <h2>
                        {userFollowers?.length ? userFollowers.length : 0}
                      </h2>
                    </div>
                    <div
                      onMouseLeave={handleHiddenMenu}
                      onMouseEnter={() => {
                        handleShowMenu();
                      }}
                      className="grid text-center border   border-black hover:border-white p-1 rounded-xl"
                    >
                      <h1>Following</h1>
                      <h2>
                        {userFollowing?.length ? userFollowing.length : 0}
                      </h2>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          <div className="w-3/4 gap-2 rounded-full  p-1 mx-auto justify-around flex bg-slate-700">
            <div
              className={`${isFollowed ? "" : "bg-[#4F4B4B]"} w-full py-1 text-center rounded-full `}
            >
              {isPendding ? (
                <>
                  <h1>Pendding</h1>
                </>
              ) : (
                <>
                  {!isFollowed ? (
                    <h1 className="cursor-pointer" onClick={handelFollow}>
                      Follow
                    </h1>
                  ) : (
                    <h1 className="cursor-pointer" onClick={handleUnFollow}>
                      Unfollow
                    </h1>
                  )}
                </>
              )}
            </div>
            <div
              className={`w-full text-center py-1 rounded-full  ${!isFollowed ? "" : "bg-[#4F4B4B] text-slate-950"} `}
            >
              <h1>Massage</h1>
            </div>
          </div>
        </div>
        {/* Post part */}
        <div className="bg-gray-700 grid gap-3 sm:p-10 p-5 m-2 rounded-lg">
          <div className="flex mx-auto    justify-between  ">
            <div className="w-fit my-auto  px-16  rounded-full text-center bg-black text-white">
              <h1 className="">Posts</h1>
            </div>
            <div className="w-fit my-auto  px-16 rounded-full text-center  ">
              <h1>Tags</h1>
            </div>
          </div>
          <div className="flex justify-center  gap-2  flex-wrap">
            {userPost?.length > 0 ? (
              userPost.map((post, index) => (
                <>
                  <Post
                    postId={post._id}
                    url={new URL(post.url, import.meta.url).href}
                    userName={userDetails.userName}
                    caption={post.caption}
                    proPicture={
                      new URL(userDetails.imgAdd, import.meta.url).href
                    }
                    index={index}
                  ></Post>
                </>
              ))
            ) : (
              <h1>No Post Yet</h1>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default userProfile;
