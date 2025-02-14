import React, { useContext, useRef, useState } from "react";
import { Background } from "../Contexts/sm";
import { motion } from "framer-motion";
import RedirectBtn from "./RedirectBtn";
import SearchBaar from "./SearchBaar";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

function Nav() {
  const { sm,currentUser,userName, searchTerm,  filteredUsers,
    setFilteredUsers,
    setSearchTerm, } = useContext(Background);
  const [showSearch,setShowSearch]=useState(false);
  const navigate=useNavigate();
const [showNotification,setShowNotification]=useState(false);
 const [showNav,setShowNav]=useState(false);
 

 const handleSearch = (event) => {
  const term = event.target.value.toLowerCase();
  setSearchTerm(term);

  if (term.trim() === "") {
    setFilteredUsers([]);
  } else {
    const filtered = userName.filter((user) =>
      user.userName.toLowerCase().includes(term),
    );
    setFilteredUsers(filtered);
  }
};

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay for each word
      },
    },
  };
  const wordVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };
  return (
    <>
      <motion.nav

      animate={showNav?'animate':'initial'}
      variants={{
        initial:{
          width: ['fit-content','2.2%'],
          height:['fit-content','6%'],
        },
          animate:
            {
              width: "min-content",
              height:"fit-content",
            }
        
      }}
      style={{
        width: "fit-content", // Ensure the initial width is fit-content
      }}
      transition={{
        duration: 0.3,
          // type:'spring',
          damping:15,
          mass:1,
          // stiffness:100,
          toughness:100,
          staggerChildren:1.5,
          delayChildren: 1,
          
      }}  
        onMouseOver={()=>setShowNav(true)}

     onMouseLeave={()=>setShowNav(false)}

      className="bg-black overflow-hidden MainFont text-white fixed z-20 rounded-r-xl p-1 pt-1 px-5 pb-4 w-2/3 ">
  <div className="cursor-pointer w-fit my-auto hover:text-black hover:bg-white duration-300 rounded-lg p-1">
  {!showNav? <>
      <i className="bi bi-list my-auto" onMouseEnter={()=>setShowNav(true)}></i>
    </>:<>
    <i className="bi bi-x-lg my-auto"
     onMouseLeave={()=>setShowNav(false)}
    ></i>
    
    </>}
  </div>
    { 
      <>
        <div 
        onClick={()=>{
          navigate('/profile')
        }} className="text-center cursor-pointer   bg-orange-400 rounded-[20px] p-1 my-2">
          <img
            src={new URL(currentUser?.imgAdd,import.meta.url).href}
            className="rounded-full border-black border-2 p-1 object-cover    mx-auto w-2/3"
            style={{
              aspectRatio:'2/2'
            }}
            alt=""
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {`Hellow ${currentUser?.Fname}`.split("").map((word, index) => (
              <motion.span key={index} className="mx-1" variants={wordVariants}>
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <div className="grid gap-2 justify-center text-center">
          
          <RedirectBtn 
          path={'/'}
          title='Home'
          sm={sm}
          extraIcon={'bi bi-house'}
          ></RedirectBtn>
           
           <RedirectBtn 
          title='Search'
          sm={sm}
          onClick={()=>{

              setShowSearch(!showSearch)
              showNotification?setShowNotification(!showNotification):null
          }}
          extraIcon={'bi bi-search'}
          ></RedirectBtn>
        <div>

          
           <RedirectBtn 
           sm={sm}
          title='Notification'
          onClick={()=>
          {
           setShowNotification(!showNotification);
           showSearch?setShowSearch(!showSearch):null;

          }
          }
          extraIcon={'bi bi-app-indicator'}
          ></RedirectBtn> 
           <RedirectBtn 
           
           sm={sm}
          title='Setting'
          extraIcon={'bi bi-gear'}
          ></RedirectBtn> 
          
        </div>
        </div>
        <div></div>
  {showSearch&& showNav && <SearchBaar onMouseEnter={()=>setShowNav(true)} onMouseLeave={()=>setShowNav(false)}  filteredUsers={filteredUsers} onChange={()=>{
    handleSearch(event);
  }}/>}

{

showNotification && showNav&&
<>
 <Notification></Notification>
</>
}

  </>
}   

</motion.nav>
      
    </>
  );
}

export default Nav;
