for(var i=1;i<=5;i++)
inputs.innerHTML+="<p><input id='m"+i+"' placeholder='Mark'><input id='c"+i+"' placeholder='Credit'></p>";
function calc(){
var total=0,points=0,credits=0,pass=true;
for(var i=1;i<=5;i++){
var m=+document.getElementById("m"+i).value;
var c=+document.getElementById("c"+i).value;
total+=m;points+=m*c;credits+=c;
if(m<35)pass=false;
}
var avg=points/credits;
var grade=avg>=90?"O":avg>=80?"A+":avg>=70?"A":avg>=60?"B+":"B";
result.innerHTML="Total: "+total+" Average: "+avg.toFixed(2)+" Grade: "+(pass?grade:"F");
result.className=pass?"pass":"fail";
}