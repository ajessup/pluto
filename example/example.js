require.paths.unshift(__dirname);
require.paths.unshift(__dirname+'/../lib/server');
require.paths.unshift(__dirname+'/deps');

var sys = require("sys"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs"),
	ws = require("ws"),
	io = require('socket.io');

var Pluto = require('pluto').Pluto;

var WEB_SERVER_PORT = 3000,
	WEB_SERVER_DOCROOT = 'public/',
	PLUTO_CLIENT_LIBRARY = '../lib/client/'

// START A SIMPLE WEBSERVER

var webServer = http.createServer(function(request, response) {  
    var uri = url.parse(request.url).pathname;
	var filename;
	
	// Map requests to the uri /pluto-client to the /lib/client directory
	if( uri.indexOf("pluto-client") != -1 ) {
		var substitution_pos = uri.indexOf("pluto-client") + 12;
		filename = path.join(__dirname, "../lib/client", uri.substr(substitution_pos,uri.length-substitution_pos));
	} else {
		filename = path.join(__dirname, WEB_SERVER_DOCROOT, uri);
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
});

webServer.listen(WEB_SERVER_PORT);  
  
sys.puts("Web server running at http://localhost:"+WEB_SERVER_PORT+"/");

// BIND PLUTO TO A TRANSPORT CHANNEL (SOCKET.IO)

var socket = io.listen(webServer); 
var plutoServer = new Pluto(function() {});

socket.on('connection', function(client){ 
	
	client.onPlutoUpdate = function(data) {
		this.send(data);
	}
	
	plutoServer.addClient(client);
	
	client.on('message', function(data) {
		sys.puts("Received DATA " + data);
		plutoServer.update(client, data);
	}) 
    client.on('disconnect', function() { 
		plutoServer.removeClient(client); 
	});
	
});

sys.puts("WebSocket server running at http://localhost:8080/");
