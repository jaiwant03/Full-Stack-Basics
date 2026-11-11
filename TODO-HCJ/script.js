var tasks=[];
function show(){
list.innerHTML="";
for(var i=0;i<tasks.length;i++)
list.innerHTML+="<li>"+tasks[i]+" <button onclick='del("+i+")'>Delete</button></li>";
}
function add(){
if(task.value!=""){
tasks.push(task.value);
task.value="";
show();
}
}
function del(i){
tasks.splice(i,1);
show();
}