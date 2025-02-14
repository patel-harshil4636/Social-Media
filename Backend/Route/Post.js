const express = require("express");
const { getCurrentUser } = require("../Services & Authentications/finds");
const LikeAndComment = require("../Module/PostLikeComment");
const Post = require("../Module/Posts");
const User = require("../Module/Users");

const post = express.Router();



// check the collection will be stored in the database or not?
const checkAwailablePostInDb = async (postId) => {
  const result = await LikeAndComment.findOne({ postId: postId });
  if (result) {
    return true;
  } else return false;
};
// for the toggle like



const toggleLike = async (postId, currentUser) => {
  // console.log('current User From Toggle Like', currentUser);
  const post = await LikeAndComment.findOne({
    postId: postId,
    likedBy: {
      $elemMatch: {
        userId: currentUser?._id,
        userName: currentUser.userName,
      },
    },
  });
  if (post) return true;
  else return false;
};



// to the add like in the database
post.post("/add/like/:postId", async (req, res) => {
  const currentUser = await getCurrentUser(req.user.Email);
  const awail = await checkAwailablePostInDb(req.params.postId);


  // the function return true when ever the same etry are awailable and then it can toggle the collection of the LikeAndComments 
  const toggleLikes = await toggleLike(req.params.postId, currentUser);
  

  if (awail) {
    const addLike = await LikeAndComment.findOneAndUpdate(
      { postId: req.params.postId },
      {
        $push: {
          likedBy: { userId: currentUser?._id, userName: currentUser.userName },
        },
      },
      { new: true },
    );
    
    if (toggleLikes) {
      const removeLike = await LikeAndComment.findOneAndUpdate(
        {
          postId: req.params.postId,
          likedBy: { $elemMatch: { userId: currentUser?._id } },
        },
        { $pull: { likedBy: { userId: currentUser?._id } } },
        { new: true },
      );
    }
  } else {
    const addLike = await LikeAndComment.create({
      postId: req.params.postId,
      likedBy: [{ userId: currentUser?._id, userName: currentUser.userName }],
    });
  }

});




post.get('/getUser/:postId',async(req, res,) => {
  // console.log(req.params.postId);
  
      const postDetails=await Post.findOne({_id: req.params.postId});
      const user = await User.findOne({_id:postDetails.createdBy});
      // console.log(user);
      res.json({
        userName:user.userName,
        profilePic:user.imgAdd,
      });
})

// to send The perticular post Like Comments data 
post.get("/get/:postId", async (req, res) => {
  const postDetails = await LikeAndComment.findOne({
    postId: req.params?.postId,
  });

  res.json(postDetails);
});

module.exports = post;
