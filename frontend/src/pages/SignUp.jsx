import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store/userStore';

const SignUp = () => {
  const [formData, setformData] = useState({ username: '', email: '', password: '' });
  const { sign } = userStore();
  const nav = useNavigate();

  const handleSign = async (e) => {
    e.preventDefault();
    console.log(formData.username);
    console.log(formData.password);
    console.log(formData.email);
    const res= await sign (formData);
    console.log(res);
    if(res.status === 200) { nav("/login"); }
    else { alert(res.message); }
  }

  return (
    <div>
      <form onSubmit={handleSign}>
        <label>Name :</label>
        <input
          name="username"
          value={formData.username}  
          onChange={(e) => setformData({ ...formData, username: e.target.value })}
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
