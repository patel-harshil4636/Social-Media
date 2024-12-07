import React, { useContext, useEffect, useState } from "react";
// import img from '../assets/uploads/6743002120dcd39890599df9-Profile Picture.JPG'
import { color, motion } from "motion/react";
import WarningBtn from "./WarningBtn";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RedirectBtn from "./RedirectBtn";
import { Background } from "../Contexts/sm";

function Nav() {
  // const [toggle, setToggle] = useState(false);
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState(null);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [userName, setUserNames] = useState([]);

  const { sm, searchData } = useContext(Background);

  const [newPost, setNewPost] = useState(null);
  // console.log(sm);

  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const [caption, setCaption] = useState(null);
  const [toggle, setToggle] = useState(false);
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
      const names = jsonData.map((user) => user.userName); // mapping is the method to the get array.....
      setUserNames(names);
    };
    getUser(); //userName?.filter((name)=>name.userName.includes('AD47'))
  }, []);

  // console.log(userName);
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers([]);
    } else {
      const filtered = userName.filter((user) =>
        user.toLowerCase().includes(term),
      );
      setFilteredUsers(filtered);
    }
  };

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
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error.message);
      alert("File upload failed!");
    }
  };
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
    }
    fetchData();
  }, []);

  console.log();

  return (
    <>
      <nav className="w-full py-2 sm:py-2 sm:relative fixed bottom-0 flex justify-center px-3   items-center   bg-slate-900 text-white">
        <div className="sm:w-2/5 mx-auto">
          <div className="flex sm:gap-6 gap-1 mx-auto my-auto">
            <RedirectBtn title={"Home"} className={""} path={"/"} sm={sm} />
            {location.pathname != "/Search" && (
              <RedirectBtn
                title={"Search"}
                className={""}
                path={"/Search"}
                sm={sm}
              />
            )}
            {location.pathname == "/Search" && (
              <div className="text-black">
                <input
                  type="text"
                  className="px-3 rounded-full"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search for a user..."
                />
                <ul
                  className={`absolute grid gap-3 py-2 bg-slate-900 px-5 ${!sm ? "bottom-16 rounded-t-xl" : ""}  ${searchTerm == "" || searchTerm.includes(" ") || filteredUsers.length == 0 || searchTerm.includes(data?.userName) ? "hidden" : ""} `}
                >
                  {filteredUsers.map(
                    (user, index) =>
                      user != data.userName && (
                        <button
                          key={index}
                          onClick={(e) => {
                            setSearchTerm(e.target.textContent);
                            navigate(
                              `/search/user/${e.currentTarget.textContent}`,
                            );
                          }}
                          className=" w-full "
                        >
                          <div className="flex gap-2 justify-stretch items-center">
                            <img
                              src={
                                searchData?.find(
                                  (value) => value.userName === user,
                                ).imgAdd
                              }
                              alt=""
                              style={{
                                aspectRatio: "2/3",
                              }}
                              className="sm:w-14 sm:h-14 w-9 h-9 object-cover rounded-full "
                            />
                            <li
                              className={` ${index == filteredUsers.length - 1 && sm ? "rounded-b-xl pb-2" : ""} ${!sm && index == 0 ? "rounded-t-xl pt-1" : ""} bg-slate-900 text-white   `}
                              style={{ listStyle: "none" }}
                            >
                              {user}
                            </li>
                          </div>
                        </button>
                      ),
                  )}
                </ul>
              </div>
            )}
            {location.pathname == "/profile" && !sm && (
              <>
                <div
                  className={` ${!toggle ? "hidden" : ""}   bg-slate-600 w-3/5 rounded-xl rounded-b-none absolute bottom-10 right-10 p-3`}
                >
                  <form
                    encType="multipart/form-data"
                    onSubmit={handleUpload}
                    method="post"
                    className="w-fit"
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
                        setToggle(!toggle);
                        console.log(e.target.files);
                        setFile(URL.createObjectURL(e.target.files[0]));
                        setFiles(e.target.files[0]);
                      }}
                    />

                    <input
                      type="text"
                      name="cap"
                      onChange={(e) => setCaption(e.target.value)}
                      className="bg-transparent border-b-2 outline-none border-black"
                    />

                    <WarningBtn title={"Upload"} className="mt-5"></WarningBtn>
                  </form>
                </div>
                <RedirectBtn
                  title={"Add"}
                  extraIcon={"bi bi-plus-square-fill text-sm "}
                  className={" w-fit"}
                  path={""}
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                  sm={sm}
                />
              </>
            )}
            <RedirectBtn
              title={"Explore"}
              className={""}
              path={"/Search"}
              sm={sm}
            />
          </div>
        </div>
        {sm && location.pathname != "/profile" && (
          <div
            className={`sm:w-1/6 ${!sm ? " " : "me-8 px-3"}  flex  cursor-pointer   rounded-xl ${toggle ? "bg-slate-200 shadow-md shadow-black" : "bg-neutral-700"} duration-100 `}
            animate={{}}
            onClick={() => setToggle(!toggle)}
          >
            <h1
              className={`text-black ${toggle ? "animate-bounce " : " text-white"} ${!sm ? "hidden " : ""}  sm:text-2xl  text-sm duration-200 my-auto`}
            >
              {data?.Fname} {data?.Lname}
            </h1>
            <motion.img
              initial={{
                marginLeft: sm ? "auto" : "0",
              }}
              animate={{
                marginRight: toggle ? "auto" : "0",
              }}
              transition={{
                duration: 0.5,

                type: "spring",
                damping: 100,
              }}
              src={data?.imgAdd}
              className=" w-2/12   my-auto rounded-full object-cover"
              alt=""
            />
          </div>
        )}
        {!sm && location.pathname != "/profile" && (
          <Link to={"/profile"}>
            <motion.img
              src={data?.imgAdd}
              className={` w-14 h-14 sm:h-0 my-auto ${!sm ? "ms-auto" : ""} rounded-full object-cover `}
              alt=""
            />
          </Link>
        )}
        <motion.div
          className={`absolute ${sm ? "hidden" : ""}  sm:w-1/6 bg-slate-200 right-10 rounded-md p-2 top-14 text-black`}
          initial={{
            display: "none",
          }}
          animate={{
            display: toggle && sm ? "block" : "none",

            y: toggle ? [-20, 0] : [0, -20],
            opacity: toggle ? [0, 1] : [1, 0],
          }}
          transition={{
            delay: 0,
            duration: 0.1,
            type: "spring",
            damping: 10,
          }}
        >
          <ul>
            <li>
              <div className="text-xl  flex my-auto">
                <i className="bi bi-person-circle"></i>&nbsp; - &nbsp;
                <h2 className="text-sm font-semibold my-auto">
                  {data?.userName}
                </h2>
              </div>
            </li>
            <li>
              <div className="text-xl flex">
                <i className="bi bi-envelope-check-fill"></i>&nbsp; - &nbsp;
                <h2 className="text-sm font-semibold my-auto">{data?.email}</h2>
              </div>
            </li>
            <li className="flex">
              <WarningBtn
                title={"Log-Out"}
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/logout");
                }}
              ></WarningBtn>
              <RedirectBtn
                title={"Profile"}
                className={"text-xl"}
                path={"/profile"}
              ></RedirectBtn>
            </li>
          </ul>
        </motion.div>
      </nav>
    </>
  );
}

export default Nav;
