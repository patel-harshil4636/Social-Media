import React, { useContext, useEffect, useState } from "react";
import Nav from "../Component/Nav";
import { Background } from "../Contexts/sm";
import WarningBtn from "../Component/WarningBtn";
import js from "@eslint/js";

function Profile() {
  const { sm, profileFData } = useContext(Background);
  const [toggle, setToggle] = useState(false);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null);
  const [newPost, setNewPost] = useState(null);

  const [caption, setCaption] = useState(null);

  const { data } = useContext(Background);
  const [posts, setPosts] = useState([]);

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

    fetchData();
  }, [newPost]);

  console.log(profileFData);

  return (
    <>
      <Nav></Nav>
      <div className=" overflow-x-hidden bg-zinc-600 ">
        <div className=" text-gray-300 flex  justify-center gap-6 rounded-b-3xl">
          <img
            src={data?.imgAdd}
            className="w-1/4 sm:w-1/6 sm:h-60 h-24    rounded-full object-cover my-auto justify-items-start object-center"
            alt=""
          />
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
              <div className="text-sm grid text-center border px-2 rounded-lg  hover:bg-black hover:text-white duration-200  cursor-pointer  my-auto">
                <h1 className="font-bold ">Following</h1>
                <h1 className="font-bold ">{profileFData.following?.length}</h1>
              </div>
            </div>
            <h1 className="font-bold sm:text-2xl my-1">
              <i className="bi bi-person-circle text-xl"></i>&nbsp; - &nbsp;
              {data?.userName}
            </h1>
            <h1 className="font-bold sm:text-2xl text-black text-center">
              {data?.Fname} {data?.Lname}
            </h1>
          </div>
        </div>
      </div>
      <div className="border bg-neutral-500 pb-12  text-white rounded-lg">
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
        <div className="flex  flex-wrap  gap-4 p-3 justify-center w-fit sm:w-5/6 mx-auto">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-slate-100 rounded-tl-none  rounded-xl"
            >
              <h1 className="text-black ms-2 font-thin">{data?.userName}</h1>
              <img
                className="w-fit sm:h-80 h-52   object-cover  object-center mx-auto rounded-b-xl  "
                src={[post?.url]}
                alt="a"
                style={{
                  aspectRatio: "4/5",
                }}
              />
              <div className="ms-2 flex gap-2">
                <i className="bi bi-heart-fill text-pink-700 text-xl"></i>
                <i className="bi bi-chat  text-xl text-black"></i>
              </div>
              <h2 className="text-black ms-2">Caption: {post.caption}</h2>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
