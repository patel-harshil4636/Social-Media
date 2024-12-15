const express = require("express");
const Api = express.Router();
const FFData = require("../Module/Followers");
const User = require("../Module/Users");
const Post = require("../Module/Posts");

Api.get("/ffdata", async (req, res) => {
  const followers = await FFData.find(
    { email: req?.user?.Email },
    { followers: 1, _id: 0 },
  );
  const following = await FFData.find(
    { email: req?.user?.Email },
    { Following: 1, _id: 0 },
  );

  // console.log(following);
  // console.log(followers);

  res.json({ following, followers });
});

Api.get("/checkFollowed/:userName", async (req, res) => {
  console.log("OK FROM FOLLOWED");

  const currentUser = await User.findOne({ email: req.user?.Email });
  const checkedFollowing = await FFData.find({
    userName: currentUser?.userName,
    Following: req.params.userName,
  });

  res.json(checkedFollowing);
});

Api.post("/follow/:userName", async (req, res) => {
  console.log(req.params.userName);
  const currentUser = await User.findOne({ email: req?.user?.Email });
  // console.log(currentUser.email);
  const Op = await User.findOne({ userName: req.params.userName });
  const isExist = await FFData.findOne({ userId: currentUser._id });
  const isOpExist = await FFData.findOne({ userName: req.params.userName });
  if (!isOpExist) {
    const updateOpFollower = await FFData.create({
      userName: req.params.userName,
      userId: Op._id,
      followers: [currentUser.userName],
      email: Op.email,
    });
  } else {
    const addFollower = await FFData.findByIdAndUpdate(
      { _id: isOpExist._id },
      { $push: { followers: currentUser.userName } },
      { new: true },
    );
  }
  if (!isExist) {
    const userToFollow = await FFData.create({
      userName: currentUser.userName,
      userId: currentUser._id,
      Following: [req.params.userName],
      email: req.user.Email,
    });
    res.json(userToFollow);
  } else {
    const addFollower = await FFData.findByIdAndUpdate(
      { _id: isExist._id },
      { $push: { Following: req.params.userName.toString() } },
      { new: true },
    );
  }
});

Api.get("/ffdata/:userName", async (req, res) => {
  const data = await FFData.find(
    { userName: req.params.userName },
    { followers: 1, Following: 1, _id: 0 },
  );
  console.log("this", data);
  res.json(data);
});

Api.delete("/unfollow/:userName", async (req, res) => {
  const fetchUser = await User.findOne({ email: req.user?.Email });
  const deleteFollowig = await FFData.findOneAndUpdate(
    { userId: fetchUser?._id },
    { $pull: { Following: req.params.userName.toString() } },
    { new: true },
  );

  console.log(fetchUser);

  const deleteFollower = await FFData.findOneAndUpdate(
    {
      userName: req.params.userName,
    },
    { $pull: { followers: fetchUser.userName } },
    { new: true },
  );
  // console.log(deleteFollowig);
});

Api.delete('/deleteOnePost/',async(req,res)=>
{
  const deletePost= await Post.findOneAndDelete({url:req.body.imgAdd,userName:req.body.userName},{});
    console.log(deletePost);
    
    res.json(deletePost);
})

module.exports = Api;
