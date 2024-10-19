import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";

import { Videos, ChannelCard } from ".";
import {
  loginAPI,
  loginAPIAsyncKey,
  loginFacebookAPI,
} from "../utils/fetchFromAPI";
import { toast } from "react-toastify";
import ReactFacebookLogin from "react-facebook-login";

const Login = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div className="p-5 " style={{ minHeight: "100vh" }}>
      <div className=" d-flex justify-content-center">
        <form className="row g-3 text-white">
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input type="email" className="form-control" id="email" />
          </div>

          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">
              Password
            </label>
            <input className="form-control" id="pass" />
          </div>
          <div className="col-md-4">
            <label htmlFor="inputEmail4" className="form-label">
              Code
            </label>
            <input className="form-control" id="code" />
          </div>

          <div className="col-12">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                let email = document.getElementById("email").value;
                let pass_word = document.getElementById("pass").value;
                let code = document.getElementById("code").value;
                console.log(email, pass_word);
                loginAPIAsyncKey({ email, pass_word, code })
                  .then((result) => {
                    // pop up khi thnah cong
                    toast.success(result.message);
                    //luu accesss token trong local storage
                    localStorage.setItem("LOGIN_USER", result.data.token);
                    // chuyen huong sang tran chu khi thnah cong
                    navigate("/");
                  })
                  .catch((error) => {
                    // console.log("error API login");
                    toast.error(error.response.data.message);
                  });
              }}
            >
              Login
            </button>
            <Link className="text-primary" to="/forgot-pass">
              Forgot password
            </Link>

            <ReactFacebookLogin
              appId="1085787246223971"
              fields="name,email,picture"
              callback={(response) => {
                let { id, email, name } = response;
                loginFacebookAPI({ id, email, name })
                  .then((result) => {
                    toast.success(result.message);
                    localStorage.setItem("LOGIN_USER", result.data.token);
                    navigate("/");
                  })
                  .catch((error) => {
                    toast.error(error.response.data.message);
                  });
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
