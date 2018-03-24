
var fs=require("fs")

var express = require('express')
var path = require('path')
var app = express()

app.use(express.static(path.join(__dirname, '/')));
app.get('/',function (req, res) {

	var pathname = "index.html"
	
	res.writeHead(200, {"Content-Type": "text/html"});
	fs.readFile(pathname,function (err,data){
		res.end(data);
	})

}).listen(3000);
console.log("Server running at 3000");