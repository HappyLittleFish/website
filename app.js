var url  = require("url"),
fs=require("fs"),
http=require("http"),
path = require("path");
http.createServer(function (req, res) {

	var pathname = "index.html"
	
	res.writeHead(200, {"Content-Type": "text/html"});
	fs.readFile(pathname,function (err,data){
		res.end(data);
	})

}).listen(8888);
console.log("Server running at localhost");