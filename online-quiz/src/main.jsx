import React,{useState} from "react";
import{createRoot}from"react-dom/client";
import "./style.css";
function App(){
const [a,setA]=useState(["",""]),[score,setScore]=useState(null);
const q=["HTML stands for?","CSS is used for?"];
const ans=["Hyper Text Markup Language","Styling"];
function submit(){setScore(a.filter((x,i)=>x.toLowerCase()==ans[i].toLowerCase()).length);}
return <div className="quiz"><h2>Online Quiz</h2>{q.map((x,i)=><div key={i}><p>{x}</p>{i===0?ans.concat("High Text").map(y=><label key={y}><input type="radio" name="q1" onChange={()=>setA(a.map((v,j)=>j===i?y:v))}/>{y}</label>):<input placeholder="Fill in the blank" onChange={e=>setA([a[0],e.target.value])}/>}</div>)}<button onClick={submit}>Submit</button><h3>{score===null?"":"Score: "+score+"/2"}</h3></div>;
}
createRoot(document.getElementById("root")).render(<App/>);