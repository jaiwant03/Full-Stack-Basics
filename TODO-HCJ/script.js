var tasks=[];
function show(){
list.innerHTML="";
for(var i=0;i<tasks.length;i++)
list.innerHTML+="<li>"+tasks[i]+" <button onclick='edit("+i+")'>Edit</button> <button onclick='del("+i+")'>Delete</button> <button onclick='done("+i+")'>Done</button></li>";
localStorage.setItem("tasks",JSON.stringify(tasks));
}
function add(){
tasks.push(task.value);
task.value="";
show();
}
function edit(i){
tasks[i]=prompt("Enter new task");
show();
}
function del(i){
tasks.splice(i,1);
show();
}
function done(i){
tasks[i]="DONE: "+tasks[i];
show();
}
tasks=JSON.parse(localStorage.getItem("tasks")||"[]");
show();