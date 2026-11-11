document.getElementById("f").onsubmit=function(e){
e.preventDefault();
let v=[n.value,m.value,p.value,a.value,w.value],err=[];
err[0]=v[0]?"":"Name required";
err[1]=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v[1])?"":"Invalid email";
err[2]=/^\d{10}$/.test(v[2])?"":"Enter 10 digit phone";
err[3]=v[3]>=18?"":"Age must be 18+";
err[4]=v[4].length>=8?"":"Password min 8 characters";
err.forEach((x,i)=>document.getElementById("e"+(i+1)).innerText=x);
if(err.every(x=>!x))alert("Registration Successful!");
};