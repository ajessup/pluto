var PlutoClient = function(uri) {
	this.init(uri);
	this.onElementMutate = function() {};
}

PlutoClient.prototype = {
	init: function(uri) {
		this.socket = new WebSocket(uri);
		this.socket.onElementMutate = function(){alert("OK")};
		
		this.socket.onmessage = function(mutateEvent){
			if(mutateEvent.data!=null) {
				this.onElementMutate(eval(mutateEvent.data));
			}
		};
	},
	mutateElement: function(operation) {
		this.socket.send(JSON.stringify(operation));
		this.socket.onElementMutate(operation);
	},
	setOnElementMutate: function(mutateFunction) {
		this.socket.onElementMutate = mutateFunction;
	}
};

