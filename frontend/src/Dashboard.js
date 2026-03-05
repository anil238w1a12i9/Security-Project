import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

const [alerts,setAlerts] = useState([]);
const [logs,setLogs] = useState([]);
const [loading,setLoading] = useState(true);
const [error,setError] = useState("");

const token = localStorage.getItem("token");

const API = "https://security-project-eyyg.onrender.com";

const fetchAlerts = async () => {

try{

const res = await axios.get(`${API}/api/auth/alerts`,{
headers:{Authorization:`Bearer ${token}`}
});

setAlerts(res.data);

}catch(err){

setError("⚠ Could not fetch alerts");

}

};

const fetchLogs = async () => {

try{

const res = await axios.get(`${API}/api/auth/activity`,{
headers:{Authorization:`Bearer ${token}`}
});

setLogs(res.data);

}catch(err){

console.log(err);

}

};

useEffect(()=>{

if(!token){

window.location.href="/";
return;

}

async function load(){

await fetchAlerts();
await fetchLogs();

setLoading(false);

}

load();

},[]);


const logout = ()=>{

localStorage.removeItem("token");
window.location.href="/";

};


if(loading){

return(

<div style={styles.loading}>

<h2>🔍 Scanning the cyber universe...</h2>
<p>Hackers are running away 🏃‍♂️</p>

</div>

);

}


return(

<div style={styles.page}>

<header style={styles.header}>

<h1>🛡 Security Dashboard</h1>

<button style={styles.logout} onClick={logout}>
Logout
</button>

</header>


<div style={styles.grid}>

<div style={styles.card}>

<h2>🚨 Security Alerts</h2>

{alerts.length===0 ? (

<p>No alerts. Hackers are sleeping 😴</p>

):(

<table style={styles.table}>

<thead>
<tr>
<th>Type</th>
<th>Severity</th>
<th>Time</th>
</tr>
</thead>

<tbody>

{alerts.map((a,i)=>(

<tr key={i}>

<td>{a.type}</td>
<td>{a.severity}</td>
<td>{new Date(a.createdAt).toLocaleString()}</td>

</tr>

))}

</tbody>

</table>

)}

</div>



<div style={styles.card}>

<h2>📜 Activity Logs</h2>

{logs.length===0 ?(

<p>No activity logs</p>

):(

<ul style={styles.logs}>

{logs.map((l,i)=>(

<li key={i}>

<strong>{l.action}</strong>

<br/>

<span>{new Date(l.createdAt).toLocaleString()}</span>

</li>

))}

</ul>

)}

</div>


</div>


<footer style={styles.footer}>

<p>Cyber Security Level: 🔥 MAXIMUM</p>

<p>Remember: Never trust free WiFi 😆</p>

</footer>

</div>

);

}

const styles = {

page:{
fontFamily:"Arial",
background:"linear-gradient(135deg,#141e30,#243b55)",
minHeight:"100vh",
color:"white",
padding:"20px"
},

header:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"30px"
},

logout:{
padding:"10px 20px",
background:"#ff4b5c",
border:"none",
color:"white",
borderRadius:"6px",
cursor:"pointer"
},

grid:{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px"
},

card:{
background:"#1f2937",
padding:"20px",
borderRadius:"10px",
boxShadow:"0 10px 20px rgba(0,0,0,0.4)"
},

table:{
width:"100%",
marginTop:"10px",
borderCollapse:"collapse"
},

logs:{
listStyle:"none",
padding:"0"
},

footer:{
marginTop:"40px",
textAlign:"center",
opacity:"0.8"
},

loading:{
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
height:"100vh",
fontSize:"22px"
}

};

export default Dashboard;