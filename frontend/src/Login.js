import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function Login() {

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

}catch(err){

setMessage("🚨 Wrong credentials! Even hackers get it wrong sometimes.");

}

};

const handleGoogleLogin = async (credentialResponse)=>{

try{

const res = await axios.post(
"https://security-project-eyyg.onrender.com/api/auth/google",
{token:credentialResponse.credential}
);

localStorage.setItem("token",res.data.token);

window.location.href="/dashboard";

}catch(err){

setMessage("Google login failed 😢");

}

};

return(

<div style={styles.page}>

<div style={styles.card}>

<h1>🔐 Security Dashboard</h1>

<p style={{color:"#888"}}>Only legends can login here</p>

<input
style={styles.input}
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
style={styles.input}
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button style={styles.button} onClick={handleLogin}>
Login
</button>

<p>or</p>

<GoogleLogin
onSuccess={handleGoogleLogin}
onError={()=>setMessage("Google Login Failed")}
/>

<br/>

<a href="/signup">Create new account 🚀</a>

<p style={{color:"red"}}>{message}</p>

</div>

</div>

);

}

const styles = {

page:{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"linear-gradient(135deg,#4facfe,#00f2fe)"
},

card:{
background:"white",
padding:"40px",
borderRadius:"12px",
boxShadow:"0 10px 30px rgba(0,0,0,0.2)",
textAlign:"center",
width:"350px"
},

input:{
width:"100%",
padding:"12px",
margin:"10px 0",
borderRadius:"6px",
border:"1px solid #ddd"
},

button:{
width:"100%",
padding:"12px",
background:"#4facfe",
border:"none",
color:"white",
fontWeight:"bold",
borderRadius:"6px",
cursor:"pointer"
}

};

export default Login;