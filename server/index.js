import express from "express";
import mongoose from "mongoose";
import UserModelModel from "./Models/Users.js";
import cors from "cors";
import UserModel from "./Models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import PostModel from "./Models/Posts.js";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//Middleware
const corsOptions = {
  //origin: "http://localhost:3001", //client URL local
  origin: "https://postit-jxdk.onrender.com/", //Host URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

// Serve static files from the 'uploads' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(__dirname + "/uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

dotenv.config(); //retrieve the configutation from the  .env file
//const PORT = process.env.PORT;
const db_username = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const db_cluster = process.env.DB_CLUSTER;

// connection string
const connectstring = `mongodb+srv://${db_username}:${db_password}@${db_cluster}/${db_name}?retryWrites=true&w=majority`;

mongoose.connect(connectstring, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/registerUser", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name: name,
      email: email,
      password: hashedpassword,
    });

    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/updateUser/:id/", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const userToUpdate = await UserModel.findOne({ _id: id });
    userToUpdate.name = name;

    //if the user changed the password, change the password in the Db to the new hashed password
    if (password !== userToUpdate.password) {
      const hashedpassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedpassword;
    } else {
      //if the user did not change the password
      userToUpdate.name = name;
      userToUpdate.password = password;
    }

    await userToUpdate.save();
    res.send({ user: userToUpdate, msg: "Updated." });
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    //Send as cookie in the browser
    res.cookie("access-token", token, {
      maxAge: 3600,
      httpOnly: true,
    });

    res.status(200).json({ user, token, message: "Success." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("access-token");

  res.status(200).json({ message: "Logged out successfully" });
});

/*POST API ROUTES */

app.post("/savePost", async (req, res) => {
  try {
    const postMsg = req.body.postMsg;
    const email = req.body.email;

    const post = new PostModel({
      postMsg: postMsg,
      email: email,
    });

    await post.save();
    res.send({ post: post, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/updatePost/:id/", async (req, res) => {
  const id = req.params.id;
  const postMsg = req.body.postMsg;
  const email = req.body.email;

  try {
    const PostToUpdate = await PostModel.findOne({ _id: id });
    PostToUpdate.postMsg = postMsg;
    await PostToUpdate.save();
    res.send({ post: PostToUpdate, msg: "Updated." });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
app.delete("/deletePost/:id/", async (req, res) => {
  const id = req.params.id;
  await PostModel.findByIdAndRemove(id).exec();
  const countPosts = await PostModel.countDocuments({});
  res.send({ msg: "Post Deleted", count: countPosts });
});
app.get("/getPosts", async (req, res) => {
  /*This uses the aggregate method of the PostModel  to perform an aggregation
   pipeline operation. The $lookup stage is used to perform 
   a left outer join with the "userinfos" collection based on the "email" field. 
   The result is an array of posts with associated user information. */
  try {
    const postsWithUsers = await PostModel.aggregate([
      {
        $lookup: {
          from: "userinfos",
          localField: "email",
          foreignField: "email",
          as: "user",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const countPost = await PostModel.countDocuments({});

    res.json({
      posts: postsWithUsers,
      count: countPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put(
  "/updateProfilePic/:userId/",
  upload.single("profPic"),
  async (req, res) => {
    const userId = req.params.userId;

    try {
      // Find the user by userId
      const userToUpdate = await UserModel.findOne({ _id: userId });

      if (userToUpdate) {
        // Update the user's profilePic field with the filename
        if (req.file.filename) userToUpdate.profilePic = req.file.filename; // 'file' is the field Multer uses

        // Save the updated user to the database
        await userToUpdate.save();

        // Respond with a success message or updated user information
        res.status(200).json({
          message: "Profile picture updated successfully",
          user: userToUpdate,
        });
      } else {
        // If the user is not found, respond with a 404 status
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      // Handle errors and respond with a 500 status
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put("/likePost/:postId/", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.body.userId;

  try {
    //search the postId if it exists
    const postToUpdate = await PostModel.findOne({ _id: postId });

    //if not return error
    if (!postToUpdate) {
      return res.status(404).json({ msg: "Post not found." });
    }

    //Search the user Id from the array of users who liked the post.
    const userIndex = postToUpdate.likes.users.indexOf(userId);

    //indexOf method returns the index of the first occurrence of a specified value in an array.
    //If the value is not found, it returns -1.

    //This code will toogle from like to unlike
    if (userIndex !== -1) {
      // User has already liked the post, so unlike it
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": -1 }, // Decrement the like count $inc and $pull are update operators
          $pull: { "likes.users": userId }, // Remove userId from the users array
        },
        { new: true } // Return the modified document
      );

      res.json({ post: updatedPost, msg: "Post unliked." });
    } else {
      // User hasn't liked the post, so like it
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { "likes.count": 1 }, // Increment the like count
          $addToSet: { "likes.users": userId }, // Add userId to the users array if not already present
        },
        { new: true } // Return the modified document
      );

      res.json({ post: updatedPost, msg: "Post liked." });
    }
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("You are connected");
});
