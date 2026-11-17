import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(email, password);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      const res = await axios.post(
        `${backendUrl}/api/user/admin`,
        {
          email,
          password,
        },
      );

      console.log("admin login res", res.data.token, res);

      if (res.data.success) {
        if (email.trim().toLowerCase() === "test@gmail.com") {
          localStorage.setItem("isDemo", "true");
        } else {
          localStorage.setItem("isDemo", "false");
        }
        setToken(res.data.token);
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = "test@gmail.com";
    const demoPassword = "Test@gmail.com";
    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/admin`, {
        email: demoEmail,
        password: demoPassword,
      });

      if (res.data.success) {
        localStorage.setItem("isDemo", "true");
        toast.success("Logged in as Demo Admin");
        setToken(res.data.token);
      } else {
        toast.error(res.data?.message || "Demo login failed");
      }
    } catch (error) {
      toast.error(error.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">
        <div>
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to manage products, categories, and customer orders.
          </p>
        </div>

        {/* Demo Credentials Hint Card */}
        {/* <div className="w-full bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-gray-600">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
              <span>🔑</span> Demo Credentials
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail("test@gmail.com");
                setPassword("Test@gmail.com");
                toast.info("Demo credentials filled");
              }}
              className="text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Auto-fill
            </button>
          </div>
          <div className="font-mono text-gray-700 space-y-0.5">
            <p><span className="text-gray-400">Email:</span> test@gmail.com</p>
            <p><span className="text-gray-400">Password:</span> Test@gmail.com</p>
          </div>
        </div> */}

        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-3 items-start w-full"
        >
          <div className="flex flex-col gap-2 w-full">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="inputField"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative w-full flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                autoComplete="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="inputField pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-gray-800 cursor-pointer focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-white bg-[#1e1e1e] hover:bg-black font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="w-full flex items-center my-1">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-400 uppercase font-medium">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-md border-2 border-gray-800 text-gray-800 hover:bg-gray-100 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
          >
            <span>⚡</span> Login as Demo Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
