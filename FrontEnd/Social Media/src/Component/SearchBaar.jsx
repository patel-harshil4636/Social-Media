import { motion } from 'framer-motion';
import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom';

function SearchBaar(props) {
    const searchBaar=useRef(null)
  // const liRef=useRef(null)
    // console.log('filtered Username',props.filteredUsers);
    const navigate=useNavigate()
  return (
    <motion.div
    initial={{
        //   height:150,
        width:0,
      opacity: 0,
    //   x: -50,
    
    }}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
    animate={{


        width:320,
        height:props.filteredUsers.length==0?'fit-content':props.filteredUsers.length>=2?props.filteredUsers.length*100:200,
      maxHeight:400,
        opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        // stiffness:1,
        type: "spring",
        damping:20,
        stiffness: 150,
        // delay: 0.5,
        ease: "easeInOut",
      },
      
    }}
    ref={searchBaar}
    className="fixed   bg-orange-300 p-5 left-[13.2em]  top-64 overflow-y-scroll rounded-bl-xl rounded-e-xl ">
          <div className='grid gap-4'>
            <input 
            onChange={props.onChange}
            type="text" 
            placeholder="Search User" 
            className="w-full p-2 text-black outline-none text-xl rounded-xl" 
            />
            {
              props.filteredUsers?.map((user,i)=>(
                <>
                <li key={i} onClick={()=>{
                  navigate(`/search/user/${user.userName}`)
                  window.location.reload();
                }} className='cursor-pointer list-none flex items-center  p-1 justify-stretch gap-3 text-center leading-10 hover:bg-black duration-300 rounded-xl '>
                 <img src={new URL(user.imgAdd,import.meta.url).href} className='w-2/6 rounded-full ' style={{
                  aspectRatio: '2/2',
                  objectFit: 'cover',
                  objectPosition: 'center',
                 }} alt="" />
                 <h1 >
                   {user.userName}
                  </h1>
                </li>
                </>
              ))
            }
          </div>
  </motion.div>
  )
}

export default SearchBaar