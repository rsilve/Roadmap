define([
    'stores/Store',
	'Constants'
], function (Store, constants) {
	
	return function (scope, dispatcher, ProjectStore) {
		
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
			return function() { 
				history.unshift(payload) 
				return true // need for dispatcher
			}
		}
		
		var undo = function() {
			history.shift();
			return true // need for dispatcher
		}
		
		
		
		// Create instance
        var store = new HistoryStore();
		
		// bind to dispatcher
		store.bind(constants.PROJECT_SAVE, function(payload) {
			return dispatcher.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_SAVE]]).
			then(push(payload))
        }).bind(constants.PROJECT_DESTROY, function(payload) {
			return dispatcher.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_DESTROY]])
			.then(push(payload))
        }).bind(constants.UNDO, function(payload) {
			return dispatcher.waitFor([ProjectStore.dispatchIndex[constants.UNDO]])
			.then(undo)
        })
		
       
		console.info("Loading HistoryStore Service " + store.id)
        return store;
	}
})
