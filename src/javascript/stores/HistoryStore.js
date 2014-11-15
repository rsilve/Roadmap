define([
    'stores/Store',
	'services/Constants',
	'moment'
], function (Store, constants, moment) {
	
	return function (scope, dispatcher, ProjectStore) {
		
		var history = [];

		// Store Object 
        function HistoryStore() {}
		// inherit from Store for events method
        HistoryStore.prototype = new Store(scope, dispatcher);

		// get the history
		HistoryStore.prototype.getHistory = function() {
			return history;
		};

		// get the last history item
		HistoryStore.prototype.last = function() {
			return history.slice(0,1).shift();
		};




		var push = function(payload) {
			return function() { 
				history.unshift({payload : payload, timestamp: moment()}) 
			}
		};
		
		var undo = function() {
			history.shift();
		};
		
		// Create instance
        var store = new HistoryStore();
		
		// bind to dispatcher
		store.bind(constants.PROJECT_SAVE, function(payload, ec) {
			return ec.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_SAVE]]).
			then(push(payload))
        }).bind(constants.PROJECT_DESTROY, function(payload, ec ) {
			return ec.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_DESTROY]])
			.then(push(payload))
        }).bind(constants.UNDO, function(payload, ec) {
			ec.waitFor([ProjectStore.dispatchIndex[constants.UNDO]])
				.then(undo)
        });
		
		
       
		console.info("Loading HistoryStore Service " + store.id);
        return store;
	}
});
