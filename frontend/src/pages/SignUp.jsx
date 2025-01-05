import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/userStore';

const SignUp = () => {
  const [formData, setformData] = useState({ name: '', email: '', password: '' });
  const { sign } = userStore();
  const nav = useNavigate();

  const handleSign = async (e) => {
    e.preventDefault();
    const res= await sign (formData);
    if(res.message === "User created") { nav("/login"); }
    else { alert(res.message); }
  }

  return (
    <div>
      <form onSubmit={handleSign}>
        <label>Name :</label>
        <input
          name="name"
          value={formData.name}  
          onChange={(e) => setformData({ ...formData, name: e.target.value })}
        />
        
        <label>Email :</label>
        <input
          name="email"
          value={formData.email}  
          onChange={(e) => setformData({ ...formData, email: e.target.value })}
        />
        
        <label>Password :</label>
        <input
          name="password"
          value={formData.password}  
          onChange={(e) => setformData({ ...formData, password: e.target.value })}
        />
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUp;
