import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/userStore';

const Auth = ({ setIsLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const nav = useNavigate();
  const { login, sign } = userStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const res = await sign(formData);
      if (res.status === 200) {
        setIsSignUp(false);
      } else {
        alert(res.message);
      }
    } else {
      const resp = await login(formData);
      if (resp && resp.status === 200) {
        setIsLogin(true);
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('email', formData.email);
        localStorage.setItem('token', resp.token);
        nav('/home');
      } else {
        alert(resp.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0F172A] to-[#111827] text-white px-4">
      <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
        CodeCollab
      </h1>
      <h2 className="text-3xl font-semibold text-gray-100 mb-8">
        {isSignUp ? 'Sign Up' : 'Login'} to CodeCollab
      </h2>
      <div className="bg-[#1E293B] p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 text-left text-lg">Username</label>
              <input 
                className="w-full px-4 py-3 bg-[#334155] border border-gray-600 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-400"
                name="username" 
                value={formData.username}  
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-left text-lg">Email</label>
            <input 
              className="w-full px-4 py-3 bg-[#334155] border border-gray-600 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-400"
              name="email" 
              value={formData.email}  
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 text-left text-lg">Password</label>
            <input 
              className="w-full px-4 py-3 bg-[#334155] border border-gray-600 rounded-lg text-white text-lg focus:ring-2 focus:ring-purple-400"
              type="password"
              name="password" 
              value={formData.password}  
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-200">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4 text-lg">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            className="text-purple-400 hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
