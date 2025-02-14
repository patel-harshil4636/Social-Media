import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../Component/Nav";
import { Background } from "../Contexts/sm";
import WarningBtn from "../Component/WarningBtn";
import js from "@eslint/js";
import { motion, animate } from "framer-motion";
import FileUploadForm from "../Component/FileUploadForm ";
import { useNavigate } from "react-router-dom";
import Post from "../Component/Post";

function Profile() {
  const navigate = useNavigate();

  const { sm, profileFData, updatedFileToggle } = useContext(Background);
  const [toggle, setToggle] = useState(false);
  const [editImgToggle, setEditImgToggle] = useState(false);
  const [file, setFile] = useState(null);
  const [showImgFrom, setShowImgFrom] = useState(false);
  const [files, setFiles] = useState(null);
  const [newPost, setNewPost] = useState(null);
  const [editCaption, setEditCaption] = useState(false);
  const [isPostDeleted, setIsPostDeleted] = useState(false);
  const [caption, setCaption] = useState(null);
  const captionRef = useRef([]);
  const [toggleEditPost, setToggleEditPost] = useState(false);
  const { data, isProfileUpdated } = useContext(Background);
  const [posts, setPosts] = useState([]);
  const followBox = useRef(null);
  const [whosTrigger, setWhosTrigger] = useState("");
  const [toggleFF, setToggleFF] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const listed = useRef(null);
  useEffect(() => {
    if (toggleFF) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [toggleFF]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("postImg", files);
    formData.append("cap", caption);

    try {
      const response = await fetch("/user/newPost", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const datas = await response.json();
      console.log(datas);
      setNewPost(datas);

      alert(`File uploaded successfully: ${datas?.originalname}`);
      // window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("/user/allPosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await data.json();
      setPosts(jsonData);
    };

    console.log(updatedFileToggle);

    fetchData();
  }, [newPost, updatedFileToggle, isPostDeleted]);

  const handleClickFollowers = (e) => {
    listed.current.click();
  };

  const handleScroll = (event) => {
    if (!followBox.current) return;

    const blackBox = followBox.current;
    if (blackBox) {
      // Adjust the scroll position of the black box
      blackBox.scrollTop += event.deltaY * 0.5;
    }

    const boxCenter = blackBox.offsetHeight / 2;
    const boxTop = blackBox.scrollTop;
    const item = Array.from(blackBox.children);
    let closestIndex = -1;
    let smallestDistance = Infinity;
    item.forEach((e, i) => {
      const itemCenter = e.offsetTop + e.offsetHeight / 2 - boxTop;

      const destanceForCenter = Math.abs(itemCenter - boxCenter);
      // console.log("destanceForCenter: ", destanceForCenter, "boxCenter");

      if (destanceForCenter < smallestDistance) {
        smallestDistance = destanceForCenter;
        closestIndex = i;
      }
    });
    setActiveIndex(closestIndex);
  };
  // console.log(profileFData);
  // console.log(editImgToggle);

  return (
    <>
      <Nav></Nav>

    
      {toggleFF && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0,
            duration: 0.5,
          }}
          ref={followBox}
          onMouseEnter={() => setToggleFF(true)}
          onMouseLeave={() => setToggleFF(!toggleFF)}
          className={`absolute max-h-[400px] overflow-y-auto
                [&::-webkit-scrollbar]:hidden
                [&::-webkit-scrollbar-track]:rounded-md
                [&::-webkit-scrollbar-track]:bg-slate-200
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-100
                dark:[&::-webkit-scrollbar-track]:bg-neutral-900
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 
                z-40 text-white opacity-100  w-1/6 h-1/5 bg-black 
                sm:right-3/4 grid gap-2 rounded-xl border shadow-2xl  shadow-blue-500 
                antialiased duration-500 p-2
              `}
        >

          {whosTrigger == "followers" &&
            profileFData?.followers?.map((follower, index) => (
              <div
                key={follower.id || index} // Always include a key for performance
                className={`flex gap-4 items-center border p-2 rounded-xl transition-all 
                    ${index === activeIndex ? "brightness-100 " : "scale-75 blur-sm brightness-50"}`}
                ref={index === activeIndex ? listed : null}
                onClick={() => {
                  navigate(`/search/user/${follower.userName}`);
                }}
              >
                <img
                  src={new URL(follower.imgAdd, import.meta.url).href}
                  alt={`${follower.userName}'s profile`}
                  style={{ aspectRatio: "1/1" }}
                  className="h-12 w-12 object-cover rounded-full"
                />
                <h1 className="text-base text-pretty font-medium">
                  {follower.userName}
                </h1>
              </div>
            ))}
          {whosTrigger == "following" &&
            profileFData?.following?.map((follower, index) => (
              <div
                key={follower.id || index} // Always include a key for performance
                className={`flex gap-4 items-center border p-2 rounded-xl transition-all 
                    ${index === activeIndex ? "brightness-100 " : "scale-75 blur-sm brightness-50"}`}
                ref={index === activeIndex ? listed : null}
                onClick={() => {
                  navigate(`/search/user/${follower}`);
                }}
              >
                {console.log(follower)}
                <img
                  src={new URL(follower.profilePic, import.meta.url).href}
                  alt={`${follower.userName}'s profile`}
                  style={{ aspectRatio: "1 / 1" }}
                  className="h-12 w-12 object-cover rounded-full"
                />
                <h1 className="text-base text-pretty font-medium">
                  {follower}
                </h1>
              </div>
            ))}
        </motion.div>
      )}
      <div className="MainFont overflow-x-hidden bg-zinc-600 duration-500 ">
        <div className=" text-gray-300 flex  justify-center gap-6 rounded-b-3xl">
          <img
            src={new URL(data?.imgAdd, import.meta.url).href}
            className={`w-1/4 sm:w-1/6 sm:h-60 h-24    rounded-full object-cover my-auto justify-items-start object-center ${editImgToggle ? "brightness-50" : ""}`}
            alt=""
            onMouseLeave={() => setEditImgToggle(false)}
            onMouseEnter={() => setEditImgToggle(true)}
          />

          {editImgToggle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0,
                duration: 0.5,
              }}
              onMouseEnter={() => setEditImgToggle(true)}
              className=" absolute z-20 translate-y-24  -translate-x-32 "
            >
              <button
                onClick={() => {
                  setShowImgFrom(!showImgFrom);
                }}
                className="bg-black rounded-2xl duration-75 p-3 text-md text-white hover:text-black hover:bg-white"
              >
                Chnage Profile
                <i
                  className={`bi  ${showImgFrom ? "bi-arrow-down" : "bi-file-earmark-image"}`}
                ></i>
              </button>
              <div className="absolute ">
                {showImgFrom && <FileUploadForm></FileUploadForm>}
              </div>
            </motion.div>
          )}
          <div className="my-auto   ">
            <div className="flex  gap-2 mx-auto  w-fit text-black">
              <div>
                <div className="text-sm grid text-center  cursor-pointer  hover:bg-black hover:text-white duration-200 border px-2 w-f rounded-lg  my-auto">
                  <h1 className="font-bold ">Post</h1>
                  <h1 className="font-bold ">{posts?.length}</h1>
                </div>
              </div>
              <div className="text-sm grid text-center  cursor-pointer  hover:bg-black hover:text-white duration-200 border px-2 w-f rounded-lg  my-auto">
                <h1 className="font-bold ">Followes</h1>
                <h1 className="font-bold ">{profileFData.followers?.length}</h1>
              </div>
              <div
                onClick={handleClickFollowers}
                onWheel={handleScroll}
                onMouseEnter={() => {
                  setWhosTrigger("following");
                  setToggleFF(!toggleFF);
                }}
                onMouseLeave={() => {
                  setWhosTrigger("");
                  setToggleFF(!toggleFF);
                }}
                className="text-sm grid text-center border px-2 rounded-lg  hover:bg-black hover:text-white duration-200  cursor-pointer  my-auto"
              >
                <h1 className="font-bold ">Following</h1>
                <h1 className="font-bold ">
                  {profileFData?.following?.length
                    ? profileFData?.following?.length
                    : 0}
                </h1>
              </div>
            </div>
            <h1 className="font-bold sm:text-2xl my-1">
              <i className="bi bi-person-circle text-xl"></i>&nbsp; - &nbsp;
              {data?.userName}
            </h1>
            <h1 className="font-bold sm:text-2xl text-black text-center">
              {data?.Fname} {data?.Lname}
            </h1>
            <button
              type="button"
              className="font-bold sm:text-xl  text-black text-center border border-slate-950 p-2 rounded-2xl  hover:bg-slate-800 hover:text-slate-50 duration-300"
            >
              Edit Profile <i className="bi bi-pencil-square"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="border MainFont bg-neutral-500 pb-12  text-white rounded-lg">
        <div className="flex ">
          <h2 className="text-xl text-center  w-full mx-auto  font-bold my-auto">
            Your Posts
          </h2>
          {sm && (
            <>
              <button
                className="text-xl text-center w-1/12  font-bold ms-auto grid"
                onClick={() => setToggle(!toggle)}
              >
                Add Post <i className="bi bi-plus-square-fill"></i>
              </button>
              <div
                className={`absolute right-5 top-80 w-1/6 bg-slate-600 rounded-xl p-2 ${!toggle ? "hidden" : ""}`}
              >
                <form
                  encType="multipart/form-data"
                  onSubmit={handleUpload}
                  method="post"
                >
                  {file && (
                    <img
                      src={file}
                      className="w-2/6 h- h-20 object-cover object-bottom rounded-xl mx-auto"
                      alt=""
                    />
                  )}

                  <label htmlFor="img">Add Img</label>

                  <input
                    type="file"
                    id="img"
                    name="postImg"
                    onChange={(e) => {
                      console.log(e.target.files);
                      setFile(URL.createObjectURL(e.target.files[0]));
                      setFiles(e.target.files[0]);
                    }}
                  />
                  <div className="flex gap-4 overflow-hidden">
                    <input
                      type="text"
                      name="cap"
                      onChange={(e) => setCaption(e.target.value)}
                      className="bg-transparent border-b-2 outline-none border-black"
                    />
                  </div>

                  <WarningBtn
                    title={"Upload"}
                    onClick={() => {
                      setToggle(!toggle);
                    }}
                    className="mt-5"
                  ></WarningBtn>
                </form>
              </div>
            </>
          )}
        </div>
        <div className="flex  flex-wrap  gap-4 p-3 text-black  justify-center w-fit sm:w-5/6 mx-auto">
          {posts.map((post, index) => (
            <Post
              postId={post._id}
              url={new URL(post.url, import.meta.url).href}
              profile={true}
              userName={data?.userName}
              caption={post.caption}
              proPicture={new URL(data?.imgAdd, import.meta.url).href}
              index={index}
            ></Post>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
