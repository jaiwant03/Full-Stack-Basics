var fs=require("fs");

// Create file
fs.writeFileSync("sample.txt","Hello World");

// Read file
var data=fs.readFileSync("sample.txt","utf8");
console.log("Read:",data);

// Append content
fs.appendFileSync("sample.txt","\nWelcome to Node JS");

// Read updated content
console.log(fs.readFileSync("sample.txt","utf8"));

// Rename file
fs.renameSync("sample.txt","new.txt");
console.log("File Renamed");

// Delete file
fs.unlinkSync("new.txt");
console.log("File Deleted");