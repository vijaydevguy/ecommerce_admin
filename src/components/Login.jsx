import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  console.log(email, password);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const res = await axios.post(
        `${backendUrl}/api/user/admin`,
        {
          email,
          password,
        },
      );

      console.log("admin login res", res.data.token, res);

      if (res.data.success) {
        setToken(res.data.token);
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center ">
      <div className="flex flex-col gap-4 bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-3 items-start w-full"
        >
          <div className="flex flex-col gap-2 min-w-72">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="inputField"
            />
          </div>

          <div className="flex flex-col gap-2 min-w-72">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="inputField"
              // className="rounded-md w-full px-3 py-2 border border-gray-300 outline-gray-400 focus:bg-gray-50"
            />
          </div>

          <button
            type="submit"
            className=" w-full py-2 rounded-md text-white bg-[#1e1e1e] cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
