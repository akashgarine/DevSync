import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../store/userStore";
import { Lock, Mail } from "lucide-react";

const Login = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const nav = useNavigate();
  const { login } = userStore();

  const handle = async (e) => {
    e.preventDefault();
    const resp = await login(formData);
    if (resp) {
      setIsLogin(true);
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("email", formData.email);
      localStorage.setItem("token", resp.token);
      localStorage.setItem("userId", resp.id);
      localStorage.setItem("role", resp.role);
      nav("/");
    } else {
      alert(resp.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-96 text-white">
        <h2 className="text-3xl font-bold text-center text-purple-400">
          Login
        </h2>
        <p className="text-gray-400 text-center mt-2">
          Welcome back! Please enter your details.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handle}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-gray-800 rounded-lg py-3 pl-10 pr-4 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-gray-800 rounded-lg py-3 pl-10 pr-4 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors py-3 rounded-lg text-white font-semibold text-lg shadow-md"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-purple-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
