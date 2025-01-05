import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/userStore';

const Login = ({ setIsLogin }) => {
  const [formData, setformData] = useState({ email: "", password: "" });
  const nav = useNavigate();
  const { login } = userStore();

  const handle = async (e) => {
    e.preventDefault();
    const resp = await login(formData);
    if (resp.message === "Logged In successfully") {
      setIsLogin(true);
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('email', formData.email);
      nav('/home');
    } else {
      alert(resp.message);
    }
  };

  return (
    <div>
      <form>
        <label>Email :</label>
        <input
          name="email"
          value={formData.email}  // Controlled value
          onChange={(e) => setformData({ ...formData, email: e.target.value })}
        />
        
        <label>Password :</label>
        <input
          name="password"
          value={formData.password}  // Controlled value
          onChange={(e) => setformData({ ...formData, password: e.target.value })}
        />
        
        <button type="submit" onClick={handle}>Submit</button>
      </form>
    </div>
  );
};

export default Login;
