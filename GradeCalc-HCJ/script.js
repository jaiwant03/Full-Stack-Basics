for(var i=1;i<=5;i++)
inputs.innerHTML+="<input type='number' id='m"+i+"' placeholder='Subject "+i+"'>";
function calc(){
var total=0,pass=true;
for(var i=1;i<=5;i++){
var m=Number(document.getElementById("m"+i).value);
total+=m;
if(m<35)pass=false;
}
var avg=total/5;
var grade=avg>=90?"A":avg>=75?"B":avg>=60?"C":avg>=50?"D":"F";
result.innerHTML="Total: "+total+" Average: "+avg+" Grade: "+grade+" "+(pass?"PASS":"FAIL");
result.className=pass?"pass":"fail";
}