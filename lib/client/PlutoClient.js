var PlutoClient = function(uri) {
	this.init(uri);
	this.onElementMutate = function() {};
}

//@TODO Explicit binding of PlutoClient to Socket.Io should be stripped out

PlutoClient.prototype = {
	init: function(uri) {
		this.socket = new io.Socket(uri);
		this.socket.onElementMutate = function(){};
		
		this.socket.on('message', function(data){
			if(data!=null) {
				this.onElementMutate(eval(data));
			}
		});
		
		this.socket.connect();
	},
	mutateElement: function(operation) {
		this.socket.send(JSON.stringify(operation));
		this.socket.onElementMutate(operation);
	},
	setOnElementMutate: function(mutateFunction) {
		this.socket.onElementMutate = mutateFunction;
	}
};

