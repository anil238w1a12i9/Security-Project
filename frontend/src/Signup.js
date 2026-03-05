import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

function Signup(){

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [message,setMessage]=useState("");

const handleSignup = async ()=>{

try{

await axios.post(
"https://security-project-eyyg.onrender.com/api/auth/signup",
{name,email,password}
);

setMessage("🎉 Account created! Now login and save the world.");

}catch(err){

setMessage("Signup failed 😢");

}

};

const handleGoogleSignup = async (credentialResponse)=>{

try{

const res = await axios.post(
"https://security-project-eyyg.onrender.com/api/auth/google",
{token:credentialResponse.credential}
);

localStorage.setItem("token",res.data.token);

window.location.href="/dashboard";

}catch(err){

setMessage("Google signup failed");

}

};

return(

<div style={styles.page}>

<div style={styles.card}>

<h1>Create Account 🚀</h1>

<input
style={styles.input}
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

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

<button style={styles.button} onClick={handleSignup}>
Signup
</button>

<p>or signup with</p>

<GoogleLogin
onSuccess={handleGoogleSignup}
onError={()=>setMessage("Google signup failed")}
/>

<br/>

<a href="/">Back to login</a>

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
background:"linear-gradient(135deg,#667eea,#764ba2)"
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
background:"#667eea",
border:"none",
color:"white",
fontWeight:"bold",
borderRadius:"6px",
cursor:"pointer"
}

};

export default Signup;