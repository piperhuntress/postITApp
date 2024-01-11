import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = process.env.REACT_APP_URL;
// Define the initial state
const initialState = {
  posts: [],
  comments: [],
  likes: [],
  status: "idle",
  error: null,
};

// Create an async thunk to fetch posts from an API
export const getPosts = createAsyncThunk("post/getPosts", async () => {
  try {
    const response = await axios.get(`${URL}/getPosts`);
    return response.data.posts;
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});

export const savePost = createAsyncThunk("posts/savePost", async (postData) => {
  try {
    const response = await axios.post(`${URL}/savePost`, {
      postMsg: postData.postMsg,
      email: postData.email,
    });
    const post = response.data.post;
    return post;
  } catch (error) {
    console.log(error);
  }
});

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    try {
      console.log(postId);
      const response = await axios.delete(`${URL}/deletePost/${postId}`);
      return postId;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (postData) => {
    try {
      //console.log(postData)
      const response = await axios.put(`${URL}/updatePost/${postData.id}`, {
        postMsg: postData.postMsg,
        email: postData.email,
      });
      const post = response.data.post;
      return post;
    } catch (error) {
      console.log(error);
    }
  }
);

export const likePost = createAsyncThunk("posts/likePost", async (postData) => {
  try {
    //Pass along the URL the postId
    const response = await axios.put(`${URL}/likePost/${postData.postId}`, {
      userId: postData.userId,
    });
    const post = response.data.post;
    return post;
  } catch (error) {
    console.log(error);
  }
});

// Create a Redux slice
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the state with fetched posts
        console.log(action.payload);
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(savePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(savePost.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "succeeded";
        // Update the state with fetched posts adding the latest post in the beginning
        state.posts.unshift(action.payload);
      })
      .addCase(savePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(deletePost.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPostIndex = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        console.log(action.payload);

        if (updatedPostIndex !== -1) {
          //state.posts[updatedPostIndex] = action.payload;
          state.posts[updatedPostIndex].postMsg = action.payload.postMsg;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        //Search the post id from the posts state
        const updatedPostIndex = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        //If found, update the likes property of the found post to the current value of the likes
        if (updatedPostIndex !== -1) {
          state.posts[updatedPostIndex].likes = action.payload.likes;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the actions and reducer
export const { toggleLike } = postSlice.actions;
export default postSlice.reducer;
