import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function Signup() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [message,setMessage]=useState("");

  const handleSignup = async () => {
    try {

      const res = await axios.post(
        "https://security-project-eyyg.onrender.com/api/auth/signup",
        {name,email,password}
      );

      setMessage(res.data.message);

    } catch(err) {
      setMessage("Signup failed");
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {

    try {

      const res = await axios.post(
        "https://security-project-eyyg.onrender.com/api/auth/google",
        {
          token: credentialResponse.credential
        }
      );

      localStorage.setItem("token", res.data.token);

      window.location.href="/dashboard";

    } catch(err) {

      console.log(err);
      setMessage("Google signup failed");

    }

  };

  return (
    <div style={{textAlign:"center",marginTop:"80px"}}>

      <h2>Signup</h2>

      <input
        placeholder="Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <br/><br/>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleSignup}>
        Signup
      </button>

      <br/><br/>

      <h3>OR</h3>

      <GoogleLogin
        onSuccess={handleGoogleSignup}
        onError={()=>setMessage("Google Login Failed")}
      />

      <p>{message}</p>

    </div>
  );
}

export default Signup;