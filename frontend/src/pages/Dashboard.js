import {useEffect,useState} from "react"
import axios from "axios"
import "./dashboard.css"
import Matrix from "react-matrix-effect"

<Matrix />
function Dashboard(){

const [alerts,setAlerts]=useState([])
const [logs,setLogs]=useState([])
const [terminalText,setTerminalText]=useState("")

const token = localStorage.getItem("token")

const API="https://security-project-eyyg.onrender.com"

useEffect(()=>{

fetchAlerts()
fetchLogs()

terminalAnimation()

},[])


const terminalAnimation = () => {

const text = "Initializing cyber defense system..."
let i=0

const interval=setInterval(()=>{

setTerminalText(text.substring(0,i))
i++

if(i>text.length){
clearInterval(interval)
}

},50)

}


const fetchAlerts = async()=>{

try{

const res = await axios.get(`${API}/api/auth/alerts`,{
headers:{Authorization:`Bearer ${token}`}
})

setAlerts(res.data)

}catch(err){

console.log(err)

}

}


const fetchLogs = async()=>{

try{

const res = await axios.get(`${API}/api/auth/activity`,{
headers:{Authorization:`Bearer ${token}`}
})

setLogs(res.data)

}catch(err){

console.log(err)

}

}


const logout = ()=>{

localStorage.removeItem("token")
window.location.href="/"

}


return(

<div className="dashboard-container">


<div className="header">

<h1 className="title">🛡 CYBER DEFENSE CENTER</h1>

<button className="logout-btn" onClick={logout}>
Logout
</button>

</div>


<div className="terminal">

<p className="typing">{terminalText}</p>

<p>Scanning network...</p>
<p>Detecting intrusions...</p>
<p>Hackers detected: 0 😎</p>

</div>



<div className="grid">

<div className="card">

<h2>🚨 Security Alerts</h2>

{alerts.length===0?(
<p>No alerts. System secure.</p>
):(

alerts.map((a,i)=>(
<div key={i} className="log-item">

<strong>{a.type}</strong>

<br/>

Severity: {a.severity}

<br/>

{new Date(a.createdAt).toLocaleString()}

</div>
))

)}

</div>



<div className="card">

<h2>📜 Activity Logs</h2>

{logs.length===0?(
<p>No activity logs</p>
):(

logs.map((l,i)=>(
<div key={i} className="log-item">

<strong>{l.action}</strong>

<br/>

{new Date(l.createdAt).toLocaleString()}

</div>
))

)}

</div>

</div>


</div>

)

}

export default Dashboard