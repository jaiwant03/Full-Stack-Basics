import React,{useState} from "react";
import{createRoot}from"react-dom/client";
import "./style.css";
function App(){
var [score,setScore]=useState(0);
var [show,setShow]=useState(false);
return <div className="quiz">
<h2>Online Quiz</h2>
<p>1. HTML stands for?</p>
<input type="radio" name="q1" onChange={()=>window.a=1}/>HTML
<input type="radio" name="q1" onChange={()=>window.a=0}/>CSS
<p>2. CSS is used for?</p>
<input id="ans" placeholder="Enter answer"/>
<button onClick={()=>{setScore((window.a||0)+(document.getElementById("ans").value.toLowerCase()=="styling"?1:0));setShow(true)}}>Submit</button>
{show&&<h3>Score: {score}/2</h3>}
</div>;
}
createRoot(document.getElementById("root")).render(<App/>);