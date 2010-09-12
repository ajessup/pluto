var setup = function(fn){
    return function(test){
		var Pluto = require('pluto').Pluto;
		var plutoServer = new Pluto(function() {});
 // TEST DATA       fn.call({hello: "world"}, test);
    }
};

exports.testSomething = setup(function(test){
	var clientOperation = eval('[{"mutation":"S","value":112},{"mutation":"D","value":1},{"mutation":"S","value":39}]');
	this.plutoServer.push(clientOperation);
    test.done();
});

