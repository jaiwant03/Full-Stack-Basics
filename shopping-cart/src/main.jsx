import React,{useState} from "react";
import{createRoot}from"react-dom/client";
import "./style.css";
function App(){
var [q,setQ]=useState([0,0,0]);
var name=["Laptop","Mouse","Keyboard"];
var price=[50000,500,1000];
var sub=0;
for(var i=0;i<3;i++)sub+=price[i]*q[i];
function change(i,v){
var a=[...q];
a[i]=Math.max(0,a[i]+v);
setQ(a);
}
return <div className="cart">
<h2>Shopping Cart</h2>
{name.map((x,i)=><p key={i}>{x} ₹{price[i]} Qty: {q[i]} <button onClick={()=>change(i,1)}>Add</button><button onClick={()=>change(i,-1)}>Remove</button></p>)}
<h3>Subtotal: ₹{sub}</h3>
<h3>GST (18%): ₹{(sub*.18).toFixed(2)}</h3>
<h2>Grand Total: ₹{(sub+sub*.18).toFixed(2)}</h2>
</div>;
}
createRoot(document.getElementById("root")).render(<App/>);