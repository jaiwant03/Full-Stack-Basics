var q=["HTML stands for?","CSS is used for?","JS is used for?"];
var ans=["HTML","Style","Interaction"];
var i=0,score=0,time=30;
function show(){
quiz.innerHTML=q[i]+"<br><input id='answer'>";
}
function next(){
if(answer.value==ans[i])score++;
i++;
if(i<3)show();
else{quiz.innerHTML="Quiz Completed";result.innerHTML="Score: "+score+"/3";clearInterval(t);}
}
var t=setInterval(function(){
time--;
timer.innerHTML="Time: "+time;
if(time==0){clearInterval(t);quiz.innerHTML="Time Over";result.innerHTML="Score: "+score+"/3";}
},1000);
show();