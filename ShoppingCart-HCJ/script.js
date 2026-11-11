var price=[50000,500,1000];
var qty=[0,0,0];
function add(i){qty[i]++;show();}
function remove(i){qty[i]=0;show();}
function show(){
var s=0;
products.innerHTML="";
for(var i=0;i<3;i++){
products.innerHTML+="<p>Product "+(i+1)+" ₹"+price[i]+" Qty: "+qty[i]+" <button onclick='add("+i+")'>Add</button><button onclick='remove("+i+")'>Remove</button></p>";
s+=price[i]*qty[i];
}
var gst=s*0.18;
total.innerHTML="Subtotal: "+s+" GST: "+gst+" Total: "+(s+gst);
}
show();