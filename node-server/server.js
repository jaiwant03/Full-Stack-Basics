var http=require("http");
var fs=require("fs");

http.createServer(function(req,res){
var page="";
if(req.url=="/")page="home.html";
else if(req.url=="/about")page="about.html";
else if(req.url=="/contact")page="contact.html";
else{
res.writeHead(404);
res.end("404 Page Not Found");
return;
}
fs.readFile("pages/"+page,function(err,data){
res.writeHead(200,{"Content-Type":"text/html"});
res.end(data);
});
}).listen(3000);

console.log("Server running at port 3000");