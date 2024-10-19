import axios from "axios";

export const BASE_URL = "http://localhost:8080";

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
    token: localStorage.getItem("LOGIN_USER"),
  },
};

// tao mot instance cua axios
export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // kiem tra flag
    if (config.requireAuth) {
      const accessToken = localStorage.getItem("LOGIN_USER");
      if (accessToken) {
        config.headers["token"] = `${accessToken}`;
      }
    }
    return config;
  },
  (error) => {}
);

// config interceptors cho res moi khi res API tra ve 401

const extendToken = async () => {
  const { data } = await axiosInstance.post(
    "/auth/extend-token",
    {},
    {
      withCredentials: true, // cho phep gui va nhan cookie yu server
    }
  );
  // luu accessToken moi vao localStorage
  localStorage.setItem("LOGIN_USER", data.data);
  return data;
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  }, // param func khi res tra ve 2xx
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        const data = await extendToken();
        console.log("data: ", data);
        originalRequest.headers["token"] = data.data;
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log("extend token failed", error);
      }
    }
    return Promise.reject(error);
  } // param func khi api tra ve khac 2xx
);

export const fetchFromAPI = async (url) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/${url}`);

  return data;
};

export const getListVideo = async () => {
  const { data } = await axiosInstance.get(`${BASE_URL}/videos/get-videos`);
  return data;
};

export const getType = async () => {
  const { data } = await axiosInstance.get(
    `${BASE_URL}/videos/get-type`,
    {
      requireAuth: true,
    },
    options
  );
  return data;
};

export const getVideoById = async (typeId) => {
  const { data } = await axiosInstance.get(
    `${BASE_URL}/videos/get-video-type-by-id/${typeId}`
  );
  return data;
};

export const registerAPI = async (payload) => {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/auth/register`,
    payload
  );
  return data;
};

export const loginAPI = async (payload) => {
  const { data } = await axiosInstance.post(`${BASE_URL}/auth/login`, payload, {
    withCredentials: true, // cho phep gui va nhan cookie tu server BE
  });
  return data;
};

export const loginAPIAsyncKey = async (payload) => {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/auth/login-async-key`,
    payload,
    {
      withCredentials: true, // cho phep gui va nhan cookie tu server BE
    }
  );
  return data;
};

export const loginFacebookAPI = async (newUser) => {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/auth/login-face`,
    newUser
  );
  return data;
};

export const forgotPassAPI = async (email) => {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/auth/forgot-password`,
    email
  );
  return data;
};
export const changePassAPI = async (payload) => {
  const { data } = await axiosInstance.post(
    `${BASE_URL}/auth/change-password`,
    payload
  );
  return data;
};
