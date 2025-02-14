import React, { useContext, useEffect, useState } from "react";
import { Background } from "../Contexts/sm";
import { motion } from "framer-motion";

function Post(props) {
  // console.log(props);
  const [postDetailsLC, setPostDetailsLC] = useState(null);
  const [likeInfo, setLikeInfo] = useState([]);
  const { currentUser } = useContext(Background);
  const [isLiked, setIsLiked] = useState(false);
  const [toggleEditPost, setToggleEditPost] = useState(false);
  const [isPostDeleted, setIsPostDeleted] = useState(false);
const [userDetails,setUserDetails] = useState(null)
  const [postEditId, setPostEditId] = useState(null); //  isdentify the post

  const handleEdit = (index) => {
    setToggleEditPost(!toggleEditPost);
    setPostEditId(index);
  };

  const handleDeletePost = async (add, uName) => {
    const conformation = prompt(
      `Are you sure you want to delete then TYPE DELETE`,
    );
    if (conformation === "DELETE" && conformation) {
      try {
        const deleteResopose = await fetch("/api/deleteOnePost", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imgAdd: add,
            userName: uName,
          }),
        }); // delete api
        const deletedPostCaption = await deleteResopose.json();
        setIsPostDeleted(!isPostDeleted);

        alert(
          "Dear " +
            data?.Fname +
            " " +
            data?.Lname +
            " your Post Created at " +
            deletedPostCaption?.createdAt.split("T")[0].replace("T", "") +
            " are Deleted",
        );
      } catch (error) {}
    }
  };

  // gethering the post Like And Comment data from the Data Base
  useEffect(() => {
    const postDetail = async () => {
      const postDetails = await fetch(
        "http://localhost:8000/post/get/" + props.postId,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await postDetails.json();
      setPostDetailsLC(data); // all like Commets Data Are hare from the Database LikeAndPost
      setLikeInfo(data?.likedBy);
    };
    postDetail();


  }, [isLiked]);

  useEffect(() => {
    likeInfo?.find((like) => {
      if (like.userId == currentUser?._id) {
        setIsLiked(true);
      }
    });
  }, [likeInfo]);


  useEffect(()=>{
    const fetchUserProfileData=async()=>{
        const respose = await fetch('http://localhost:8000/post/getUser/'+props.postId,{
          method:'GET',
          credentials:'include',
          headers:{
              'Content-Type':'application/json'
          }
        })
       const data=await respose.json();
       setUserDetails(data)
          
      }
      fetchUserProfileData()
  })

  // add the like when the like btn Cliked
  const handleLike = async () => {
    setIsLiked(true);
    const response = await fetch(
      "http://localhost:8000/post/add/like/" + props?.postId,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likedBy: {
            userName: "",
            userId: "",
          },
        }),
      },
    );
  };


  return (
    <div
      key={props?.postId}
      className="bg-[#FEFAE0] text-sm w-48  sm:text-xl sm:w-max  rounded-xl"
    >
      <div className="flex bg mx-auto">
        <div className="flex rounded-xl rounded-bl-none rounded-tr-none mb-4 p-1 px-4 justify-between gap-5 bg-[#E9EDC9]">
          <img
            src={new URL(props?.proPicture, import.meta.url).href && new URL(userDetails?.profilePic, import.meta.url).href  }
            className="rounded-full object-cover object-center w-7 h-7"
            alt=""
          />
          <h1 className="text-black my-auto  font-medium">{props?.userName}</h1>
        </div>
        {props.profile && (
          <>
            <div className="ms-auto mt-1 me-1">
              <motion.i
                animate={{
                  rotate:
                    postEditId == props.index && toggleEditPost
                      ? [0, 90]
                      : [90, 0],
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
                  handleEdit(props.index);
                }}
              ></motion.i>
            </div>
          </>
        )}
      </div>
      {postEditId === props.index && (
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
              onClick={() => {
                handleDeletePost(props.url, props.userName);
              }}
              className="flex gap-3  justify-center select-none "
            >
              Delete <i className="bi bi-trash3-fill"></i>
            </motion.li>
            <motion.li
              animate={{
                opacity: [0, 1],
              }}
              onClick={() => {
                setEditCaption(!editCaption);
                console.log(
                  captionRef.current[props.index].disabled
                    ? captionRef.current[props.index].click()
                    : "",
                );
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
        src={new URL(props.url, import.meta.url).href}
        alt="a"
        style={{
          aspectRatio: "4/5",
        }}
      />
      <div className="flex gap-2 my-2.5 items-center sm:text-xl text-sm">
        <div className=" grid  px-5  rounded-sm rounded-r-full bg-[#FADDE1]">
          <div className="flex gap-2 items-center my-auto">
            <i
              onClick={handleLike}
              className={`bi bi-heart${isLiked ? "-fill" : ""} cursor-pointer text-pink-700`}
            ></i>
            <i className="bi bi-chat   text-black"></i>
          </div>
          <div className="text-xs cursor-pointer">
            <h1>{likeInfo?.length ? likeInfo.length : "0"} likes</h1>
          </div>
        </div>

        <div className="flex  text-[#222618] py-0.5 px-2 ms-auto w-fit   rounded-l-full bg-[#E9EDC9] my-auto gap-2">
          <h3 className="mx-auto md:text-sm">{props?.caption}</h3>
        </div>
      </div>
    </div>
  );
}

export default Post;
