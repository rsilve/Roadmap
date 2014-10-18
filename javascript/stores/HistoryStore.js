define([
    'stores/Store',
	'services/Constants',
	'moment'
], function (Store, constants, moment) {
	
	return function (scope, dispatcher, ProjectStore, $interval) {
		
		var history = [];
		var scheduler = null;
		
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
				history.unshift({payload : payload, timestamp: moment()}) 
			}
		}
		
		var undo = function() {
			history.shift();
		}
		
		var cancelScheduler = function(){
			$interval.cancel(scheduler)
		} 
		var startScheduler = function(){
			scheduler = $interval(store.emitChange(), 60000);
		} 
		
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
			return dispatcher.when(cancelScheduler())
			.then(function() {
				return ec.waitFor([ProjectStore.dispatchIndex[constants.UNDO]])
			}).then(undo)
			.then(startScheduler)
        });
		
		
       
		console.info("Loading HistoryStore Service " + store.id)
        return store;
	}
})
