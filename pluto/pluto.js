var sys = require('sys');

var Pluto = function(callback) {
	this.operations = [];	// A history of operations that have been applied
	this.clients = [];		// Holds connections to all clients listening to document
	this.init(callback);
}

Pluto.prototype = {
	init: function(callback){
		callback();
	},
	addClient: function(client) {
		/*
		 * Client must define the onPlutoUpdate(data) callback
		 */
		if(client.onPlutoUpdate != null) {
			this.clients.push(client);
			sys.puts('Added client #'+this.clients.length);
			
			// Send them the all previous operations so they can build the doc
			for(var i in this.operations) {
				client.onPlutoUpdate(JSON.stringify(this.operations[i]));
			}
		}
	},
	removeClient: function(client) {
		
	},
	update: function(client, data) {
		var clientOperation = eval(data); //TODO - WAY INESECURE!! Need deserialise more safely..
		
		this.operations.push(clientOperation);
		this.broadcast(client,clientOperation);
	},
	broadcast : function(client, operation) {
		for(i=0;i<this.clients.length;i++) {
			if(this.clients[i] != client)
				this.clients[i].onPlutoUpdate(JSON.stringify(operation));
		}
	}
};

exports.Pluto = Pluto;