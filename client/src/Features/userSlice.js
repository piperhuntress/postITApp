import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = process.env.REACT_APP_URL;

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      console.log(userData);
      const response = await axios.post(`${URL}/registerUser`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      const user = response.data.user; //retrieve the response from the server
      return user;
    } catch (error) {
      console.log(error);
    }
  }
);

export const logout = createAsyncThunk("users/logout", async () => {
  try {
    // Send a request to your server to log the user out
    await axios.post(`${URL}/logout`);
  } catch (error) {
    console.log(error);
  }
});

export const login = createAsyncThunk("users/login", async (userData) => {
  try {
    const response = await axios.post(`${URL}/login`, {
      email: userData.email,
      password: userData.password,
    });
    const user = response.data.user;
    console.log(response);
    return user;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const errorMessage = "Invalid credentials";
      alert(errorMessage);
      throw new Error(errorMessage);
    } else {
      const errorMessage = "Login failed. Please check your credentials.";
      alert(errorMessage);
      throw new Error(errorMessage);
    }
  }
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData) => {
    try {
      console.log(userData);
      const response = await axios.put(`${URL}/updateUser/${userData.userId}`, {
        name: userData.name,
        password: userData.password,
      });
      const user = response.data.user;
      return user;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateProfilePic = createAsyncThunk(
  "user/updateProfilePic",
  async (formData) => {
    console.log(formData);

    try {
      const response = await axios.put(
        `${URL}/updateProfilePic/${formData.userId}`,
        {
          profPic: formData.profPic,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const user = response.data.user;
      return user;
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        // Clear user data or perform additional cleanup if needed
        state.user = {};
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateProfilePic.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfilePic.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfilePic.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userSlice.reducer;
