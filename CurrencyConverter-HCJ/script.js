function convert(){
var a=Number(amount.value);
var f=from.value;
var t=to.value;
var inr=a;
if(f=="USD")inr=a*88;
if(f=="EUR")inr=a*102;
var ans=inr;
if(t=="USD")ans=inr/88;
if(t=="EUR")ans=inr/102;
result.innerHTML="Result: "+ans.toFixed(2)+" "+t;
}