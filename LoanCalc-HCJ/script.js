function calc(){
var p=amt.value;
var r=rate.value/1200;
var n=years.value*12;
var emi=p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
var total=emi*n;
var interest=total-p;
result.innerHTML="EMI: "+emi.toFixed(2)+" Interest: "+interest.toFixed(2)+" Total: "+total.toFixed(2);
tab.innerHTML="<tr><th>Month</th><th>EMI</th></tr>";
for(var i=1;i<=n;i++)
tab.innerHTML+="<tr><td>"+i+"</td><td>"+emi.toFixed(2)+"</td></tr>";
}