import React, { useEffect, useState } from "react";
import Nav from "../Component/Nav";
import InfiniteScroll from 'react-infinite-scroll-component'
// import { post } from "../../../../Backend/Route/Users";
import Post from "../Component/Post";
function Home() {
  
  const [posts, setPosts] = useState([]);  // Store posts
  const [page, setPage] = useState(1);  // Keep track of the current page
  const [hasMore, setHasMore] = useState(true);  // Whether more posts exist

  useEffect(() => {
      fetchPosts();  // Load initial posts
  }, []);

  const fetchPosts = async () => {
      try {
          const response = await fetch(`/api/posts?page=${page}&limit=10`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          const data = await response.json();
          setPosts(prevPosts => [ ...data.posts]);  // Append new posts to existing ones
          setHasMore(data.hasMore);  // Update if more posts exist
          setPage(prevPage => prevPage + 1);  // Move to next page
      } catch (error) {
          console.error("Error fetching posts", error);
      }
  };


  
    return (
    <>
      <Nav />
      <div
      className="mx-auto text-center  w-3/6 "
      > 
      <InfiniteScroll
      dataLength={posts.length}
      next={fetchPosts}
      hasMore={hasMore}
      endMessage={<>  
      <h1>
      No More Post!
      </h1>
      </>}
      loader={<>
      <h4>
        Loading...
      </h4>
      </>}
      >
        <div  className="flex flex-wrap gap-5">
 {posts.map((post, index) => (
  <>
                      <Post caption={post.caption} index={post.index} key={post.key} url={post.url} userName={post.userName} postId={post._id} ></Post>

  </>
                
            ))}
                </div>

      </InfiniteScroll>
      </div>
    </>
  );
}

export default Home;
