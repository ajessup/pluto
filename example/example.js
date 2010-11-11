require.paths.unshift(__dirname);
require.paths.unshift(__dirname+'/../lib/server');
require.paths.unshift(__dirname+'/deps');

var sys = require("sys"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs"),
	ws = require("ws");

var Pluto = require('pluto').Pluto;

var WEB_SERVER_PORT = 3000,
	WEB_SERVER_DOCROOT = 'public/',
	PLUTO_CLIENT_LIBRARY = '../lib/client/'

// START A SIMPLE WEBSERVER

http.createServer(function(request, response) {  
    var uri = url.parse(request.url).pathname;
	var filename;
	
	// Map requests to the uri /pluto-client to the /lib/client directory
	if( uri.indexOf("pluto-client") != -1 ) {
		var substitution_pos = uri.indexOf("pluto-client") + 12;
		filename = path.join(process.cwd(), "../lib/client", uri.substr(substitution_pos,uri.length-substitution_pos));
	} else {
		filename = path.join(process.cwd(), WEB_SERVER_DOCROOT, uri);
	}
    sys.puts("Loading "+filename);
    path.exists(filename, function(exists) {  
        if(!exists) {  
            response.sendHeader(404);  
            response.write("404 Not Found\n");  
            response.close();  
            return;  
        }  
  
        fs.readFile(filename, "binary", function(err, file) {  
            if(err) {  
                response.sendHeader(500);  
                response.write(err + "\n");  
                response.close();  
                return;  
            }  
  
            response.sendHeader(200);  
            response.write(file, "binary");  
            response.end();  
        });  
    });  
}).listen(WEB_SERVER_PORT);  
  
sys.puts("Web server running at http://localhost:"+WEB_SERVER_PORT+"/");

// START A SIMPLE WEBSOCKETS SERVER

var plutoServer = new Pluto(function() {});

ws.createServer(function(websocket) {
	websocket.addListener("connect", function(resource) {
		websocket.onPlutoUpdate = function(data){
			this.write(data);
		};
		plutoServer.addClient(websocket);
		sys.puts("Received CONNECT " + resource);
	}).addListener("data", function(data) {
		sys.puts("Received DATA " + data);
		plutoServer.update(websocket, data);
	}).addListener("close", function() {
		plutoServer.removeClient(websocket);
	});
}).listen(8080);

sys.puts("WebSocket server running at http://localhost:8080/");
