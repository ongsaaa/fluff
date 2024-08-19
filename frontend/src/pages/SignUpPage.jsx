import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPublicClient } from "../utils/axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const axios = apiPublicClient;
  const nav = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(false);

  const signUpHandler = async (e) => {
    e.preventDefault();

    if (disabled) return;

    setDisabled(true);

    if (!userName || !password || !email || !firstname || !lastname) {
      toast.error("Please fill in the form", {
        position: "top-center",
        autoClose: 1000,
        pauseOnHover: false,
        onClose: () => setDisabled(false),
      });
      return;
    }

    try {
      const response = await axios
        .post("/api/register", {
          username: userName,
          password,
          email,
        })
        .then((res) => res.data);

      // console.log("Signed up successfully");
      // console.log(response)

      localStorage.setItem("jwt", response.token);
      localStorage.setItem("username", userName);

      toast.success("Signed up successfully", {
        position: "top-center",
        autoClose: 1000,
        pauseOnHover: false,
        onClose: () => {
          nav("/")
          setDisabled(false);
        },
      });

    } catch (error) {
      console.log("Error signing up");

      toast.error(error.response.data.error.error, {
        position: "top-center",
        autoClose: 1000,
        pauseOnHover: false,
        onClose: () => setDisabled(false),
      });
    }
  };

  return (
    <div className="grid w-screen h-screen grid-cols-2">
      <div>
        <img
          className="w-full h-full"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu4XanF_Pv6FwkOjOgX8eI8c0fSkzYj8vFFg&s"
        />
      </div>
      <div className="my-auto mx-16 h-fit max-w-3xl p-8">
        <h1 className="text-center text-4xl font-bold">Welcome back!</h1>
        <p className="text-center text-gray-600 font-medium">
          Sign in to continue
        </p>
        <div>
          <form className="mt-8" onSubmit={signUpHandler}>
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                for="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" for="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="">
              <label className="block text-gray-700 font-bold mb-2" for="email">
                First name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstname"
                type="firstname"
                placeholder="First name"
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="">
              <label className="block text-gray-700 font-bold mb-2" for="email">
                Last name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastname"
                type="lastname"
                placeholder="Last name"
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign Up
              </button>
              <Link
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                to="/signin"
              >
                Sign In
              </Link>
            </div>
          </form>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link className="text-blue-500 hover:text-blue-800" to="/signin">
              Sign in now!
            </Link>
          </p>
          <ToastContainer autoClose={1000} limit={1} />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
