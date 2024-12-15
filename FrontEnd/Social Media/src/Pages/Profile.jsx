import React, { useContext, useEffect, useRef, useState } from "react";
import Nav from "../Component/Nav";
import { Background } from "../Contexts/sm";
import WarningBtn from "../Component/WarningBtn";
import js from "@eslint/js";
import { motion, animate } from "framer-motion";
import FileUploadForm from "../Component/FileUploadForm ";

function Profile() {
  const { sm, profileFData, updatedFileToggle } = useContext(Background);
  const [toggle, setToggle] = useState(false);
  const [editImgToggle, setEditImgToggle] = useState(false);
  const [file, setFile] = useState(null);
  const [showImgFrom, setShowImgFrom] = useState(false);
  const [files, setFiles] = useState(null);
  const [newPost, setNewPost] = useState(null);
  const [editCaption,setEditCaption]= useState(false);
  const [isPostDeleted, setIsPostDeleted] = useState(false)
  const [caption, setCaption] = useState(null);
  const [postEditId, setPostEditId] = useState(null); //  isdentify the post
  const captionRef=useRef([]);
  const [toggleEditPost, setToggleEditPost] = useState(false);
  const { data,isProfileUpdated } = useContext(Background);
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

    console.log(updatedFileToggle);

    fetchData();
  }, [newPost, updatedFileToggle,isPostDeleted]);

  const handleEdit = (index) => {
    setToggleEditPost(!toggleEditPost);
    setPostEditId(index);
  };

  const handleDeletePost =async(add,uName)=>{
    const conformation=prompt(`Are you sure you want to delete then TYPE DELETE`);
    if(conformation==='DELETE' && conformation)
    {
      
     try {
        const deleteResopose = await fetch('/api/deleteOnePost',
          {
            method:"DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imgAdd: add,
              userName: uName,
            }),
          }
        );// delete api
          const deletedPostCaption= await deleteResopose.json();
          setIsPostDeleted(!isPostDeleted);

          alert("Dear "+data?.Fname+" " +data?.Lname+" your Post Created at "+deletedPostCaption?.createdAt.split('T')[0].replace('T','')+" are Deleted")
          
     } catch (error) {
      
     }
    }
  }
  //   console.log(profileFData);
  // console.log(editImgToggle);

  return (
    <>
      <Nav></Nav>
      <div className="MainFont overflow-x-hidden bg-zinc-600 ">
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
        <div className="flex  flex-wrap  gap-4 p-3   justify-center w-fit sm:w-5/6 mx-auto">
          {posts.map((post, index) => (
            <div key={index} className="bg-[#FEFAE0] text-sm w-48  sm:text-xl sm:w-max  rounded-xl">
              <div className="flex bg mx-auto">
             <div className="flex rounded-xl rounded-bl-none rounded-tr-none mb-4 p-1 px-4 justify-between gap-5 bg-[#E9EDC9]">
             <img
                  src={new URL(data?.imgAdd, import.meta.url).href}
                  className="rounded-full object-cover object-center w-7 h-7"
                  alt=""
                />
                <h1 className="text-black my-auto  font-medium">
                  {data?.userName}
                </h1>
             </div>
               <div className="ms-auto mt-1 me-1">
               <motion.i
                  animate={{
                    rotate:
                      postEditId == index && toggleEditPost ? [0, 90] : [90, 0],
                  }}
                  transition={{
                    duration: 0.1,
                    bounceStiffness: 1,
                    bounceDamping: 2,
                    damping: 5,
                    delayChildren: 0.5,
                    // delay: 0.5,

                    type: "spring",
                  }}
                  className="bi  bi-three-dots-vertical text-lg block  cursor-pointer text-black"
                  onClick={() => {
                    handleEdit(index);
                  }}
                ></motion.i>
               </div>
              </div>
              {postEditId === index && (
                <div className="absolute  w-fit">
                  <motion.ul
                    initial={{
                      height: 10,
                    }}
                    layout
                    animate={{
                      opacity: toggleEditPost ? [0, 1] : [1, 0],
                      // visibility:toggleEditPost?['hidden','show']:['show','hidden'],
                      height: toggleEditPost ? "auto" : 10,
                    }}
                    transition={{
                      duration: 0.1,
                      ease: "easeInOut",

                      // delay: 0.5,
                    }}
                    className="text-black relative grid gap-3 text-center cursor-pointer bg-purple-600 rounded-xl sm:left-44 left-28 p-2 bottom-2 "
                  >
                    <motion.li
                      animate={{
                        opacity: [0, 1],
                      }}
                      onClick={()=>{
                        handleDeletePost(post.url,data?.userName);
                      }}
                      className="flex gap-3  justify-center select-none "
                    >
                      Delete <i className="bi bi-trash3-fill"></i>
                    </motion.li>
                    <motion.li
                      animate={{
                        opacity: [0, 1],
                      }}
                      onClick={()=>{
                        setEditCaption(!editCaption);
                    console.log(captionRef.current[index].disabled?captionRef.current[index].click( ):'');
                      
                                            
                      }}
                      className="flex gap-3 justify-center select-none  "
                    >
                      Edit<i className="bi bi-pencil-square"></i>
                    </motion.li>
                  </motion.ul>
                </div>
              )}
              <img
                className="w-max sm:h-80 h-48 mx-5   object-cover  object-center  rounded-xl  "
                src={[post?.url]}
                alt="a"
                style={{
                  aspectRatio: "4/5",
                }}
              />
            <div className="flex gap-2 my-2.5 items-center sm:text-xl text-sm">
            <div className=" flex gap-2 px-3 items-center rounded-sm rounded-r-full bg-[#FADDE1]">
                <i className="bi bi-heart-fill text-pink-700 "></i>
                <i className="bi bi-chat   text-black"></i>
              </div>
           <div className="flex text-[#222618] py-0.5 px-2 ms-auto w-2/3   rounded-l-full bg-[#E9EDC9] my-auto gap-2">

           <h3 className="mx-auto">
           {post?.caption} 
           </h3>
           {/* <input  type="text"  className="w-fit" value={editCaption?"":post.caption} onKeyUp={()=>
                {

                }
              } disabled={editCaption&&index==postEditId?false:true } ref={(el)=>(captionRef.current[index]=el)} /> */}
           
           </div>
            </div>
            </div>
          ))}
          {
            posts.length === 0 && (
              <div className="flex justify-center items-center w-fit h-full">
                <h1 className="text-xl text-center text-black">No Posts</h1>
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

export default Profile;
