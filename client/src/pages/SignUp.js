import React, { useState } from "react";
import "./Auth.css"; // Shared CSS

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skills: ""
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, skills: form.skills.split(",") }),
    });
    const data = await res.json();
    alert(data.msg || "Signup successful!");
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup} className="auth-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          required
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          required
          onChange={e => setForm({ ...form, skills: e.target.value })}
        />
        <button type="submit">Sign Up</button>
        <p>Already have an account? <a href="/login">Log in</a></p>
      </form>
    </div>
  );
}

export default Signup;
