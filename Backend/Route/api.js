const express = require("express");
const Api = express.Router();
const FFData = require("../Module/Followers");
const User = require("../Module/Users");
const Post = require("../Module/Posts");
const Notify = require("./notify");
const { authenticateToken } = require("../Services & Authentications/authUser");
const Notification = require("../Module/Notifications");
const cookieParser = require("cookie-parser");

function sendNotification(userId, notificationData, io) {
  console.log(userId);

  io.to(userId).emit("newNotification", notificationData);
}


Api.get('/posts',async(req, res) => {
  try {
    // console.log('hellow');
    
    const page = parseInt(req.query.page) || 1;  // Get current page number from request (default is 1)
    const limit = parseInt(req.query.limit) || 10;  // Number of posts per request (default is 10)
    const skip = (page - 1) * limit;  // Skip previous posts (for pagination)

    // Fetch posts from MongoDB sorted by date (latest first)
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalPosts = await Post.countDocuments();  // Get total number of posts
      // console.log(posts)
    res.json({
        posts,  // Send fetched posts
        hasMore: skip + posts.length < totalPosts  // Check if there are more posts to load
    });
} catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
}
});

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
Api.use(cookieParser());

Api.get("/checkFollowed/:userName", async (req, res) => {
  const currentUser = await User.findOne({ email: req.user?.Email });
  const checkedFollowing = await FFData.find({
    userName: currentUser?.userName,
    Following: req.params.userName,
  });

  res.json(checkedFollowing);
});

Api.post("/follow/:userName", async (req, res) => {
  // console.log(req.params.userName); // user who are affected follow
  const currentUser = await User.findOne({ email: req?.user?.Email });

  const Op = await User.findOne({ userName: req.params.userName }); // are followed by the affected //followed id
  const notification = await Notification.create({
    userName: req.params.userName,
    message: `${currentUser.userName} Are Followed You!`,
    from: currentUser.userName,
    type: "FOLLOW",
    userId: Op.id,
  });
  sendNotification(req.params.userName, notification, req.io);
});

Api.get("/ffdata/:userName", async (req, res) => {
  const data = await FFData.find(
    { userName: req.params.userName },
    { followers: 1, Following: 1, _id: 0 },
  );
  // fetching data users profile

  const profileFollowersData = await User.find(
    { userName: { $in: data[0]?.followers } },
    {
      userName: 1,
      imgAdd: 1,
      _id: 0,
    },
  );
  const profileFollowingData = await User.find(
    { userName: { $in: data[0]?.Following } },
    {
      userName: 1,
      imgAdd: 1,
      _id: 0,
    },
  );
  const mergedDataFollowingData = data[0]?.Following.map((user) => {
    const profileInfo = profileFollowingData.find((p) => p.userName === user);
    return {
      userName: user,
      profilePicture: profileInfo ? profileInfo.imgAdd : null, // Add profilePicture or null if not found
    };
  });

  const mergedDataFollowersData = data[0]?.followers.map((user) => {
    const profileInfod = profileFollowersData.find((p) => p.userName === user);
    return {
      userName: user,
      profilePicture: profileInfod ? profileInfod.imgAdd : null, // Add profilePicture or null if not found
    };
  });

  res.json({
    followingProfile: mergedDataFollowingData, // return the followers list with profile picture
    followersProfile: mergedDataFollowersData, // return the followers list with profile picture
  });
});

Api.delete("/unfollow/:userName", async (req, res) => {
  const fetchUser = await User.findOne({ email: req.user?.Email });
  const deleteFollowig = await FFData.findOneAndUpdate(
    { userId: fetchUser?._id },
    { $pull: { Following: req.params.userName.toString() } },
    { new: true },
  );

  const deleteFollower = await FFData.findOneAndUpdate(
    {
      userName: req.params.userName,
    },
    { $pull: { followers: fetchUser.userName } },
    { new: true },
  );
  // console.log(deleteFollowig);
});

Api.post("/addFollower", async (req, res) => {
  console.log(req.body);
  const thisUserInfo = await User.findOne({ userName: req.body.userName });
  const fromUserInfo = await User.findOne({ userName: req.body.from });
  const thisUser = await FFData.findOne({ userId: thisUserInfo._id });
  const fromUser = await FFData.findOne({ userId: fromUserInfo._id });
  console.log(thisUser);
  // this is for the Add Followers List To the DataBase for this user who get the follow Req
  if (!thisUser) {
    const addFollowerToThisUser = await FFData.create({
      email: thisUserInfo.email,
      userId: thisUserInfo._id,
      followers: [req.body.from],
      userName: req.body.userName,
    });
  } else {
    addFollowerToArrayOnThisUser = await FFData.findOneAndUpdate(
      { userId: thisUser.userId },
      {
        $push: { followers: req.body.from },
      },
    );
  }
  if (!fromUser) {
    const addFollowingToFromUser = await FFData.create({
      email: fromUserInfo.email,
      userId: fromUserInfo._id,
      Following: [req.body.userName],
      userName: req.body.from,
    });
  } else {
    addFollowingToArrayOnFromUser = await FFData.findOneAndUpdate(
      { userId: fromUser.userId },
      {
        $push: { Following: req.body.userName },
      },
    );
  }
  const updateStatus = await Notification.updateOne(
    { userName: req.body.userName, from: req.body.from, type: "FOLLOW" }, // Filter
    { $set: { status: "accepted" } }, // Use $set to update the status field
  );
});

Api.delete("/deleteOnePost/", async (req, res) => {
  const deletePost = await Post.findOneAndDelete(
    { url: req.body.imgAdd, userName: req.body.userName },
    {},
  );
  console.log(deletePost);

  res.json(deletePost);
});

Api.get("/notifications/:from", async (req, res) => {
  const currentUser = await User.findOne({ email: req.user?.Email });
  // console.log("current User", currentUser?.userName);
  // console.log("to user", req.params.from);

  const notifications = await Notification.findOne(
    {
      from: currentUser?.userName,
      userName: req.params.from,
      type: "FOLLOW",
      status: "pending",
    },
    {},
    { sort: { createdAt: -1 } },
  );
  // console.log("notification",notifications);
  res.json(notifications);
});

module.exports = Api;
