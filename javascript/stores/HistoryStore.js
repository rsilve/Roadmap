define([
    'stores/Store',
	'Constants'
], function (Store, constants) {
	
	return function (scope, dispatcher) {
		
		var history = [];
		
		// Store Object 
        function HistoryStore() {}
		// inherit from Store for events method
        HistoryStore.prototype = new Store(scope, dispatcher)
		
		// get the history
		HistoryStore.prototype.getHistory = function() {
			return history;
		}
		
		var push = function(payload) {
			return function() { history.push(payload) }
		}
		
		// Create instance
        var store = new HistoryStore();
		
		// bind to dispatcher
		store.bind(constants.PROJECT_SAVE, function(payload) {
			return dispatcher.defer(push(payload))
        }).bind(constants.PROJECT_DESTROY, function(payload) {
			return dispatcher.defer(push(payload))
        })
		
       
		console.info("Loading HistoryStore Service " + store.id)
        return store;
	}
})
