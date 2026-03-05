import React,{useState} from "react";
import axios from "axios";
import {GoogleLogin} from "@react-oauth/google";

function Login(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [message,setMessage]=useState("");

const handleLogin = async () => {

  try{

    const res = await axios.post(
      "https://security-project-eyyg.onrender.com/api/auth/login",
      {email,password}
    );

    localStorage.setItem("token",res.data.token);

    window.location.href="/dashboard";

  }
  catch(err){

    setMessage("Login failed");

  }

};

const handleGoogleLogin = async (credentialResponse) => {

  try{

    const res = await axios.post(
      "https://security-project-eyyg.onrender.com/api/auth/google",
      {
        token:credentialResponse.credential
      }
    );

    localStorage.setItem("token",res.data.token);

    window.location.href="/dashboard";

  }
  catch(err){

    setMessage("Google login failed");

  }

};

return(

<div style={{textAlign:"center",marginTop:"100px"}}>

<h2>Security Dashboard Login</h2>

<input
type="email"
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

<button onClick={handleLogin}>
Login
</button>

<br/><br/>

<h3>OR</h3>

<GoogleLogin
onSuccess={handleGoogleLogin}
onError={()=>setMessage("Google Login Failed")}
/>

<br/><br/>

<a href="/signup">Create Account</a>

<p>{message}</p>

</div>

);

}

export default Login;