import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  console.log(email, pass);
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
    } catch (error) {}
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-gray-400 focus:bg-gray-100"
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
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter password"
              required
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-gray-400 focus:bg-gray-100"
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
