define([
    'stores/Store',
	'services/Constants',
	'moment'
], function (Store, constants, moment) {
	
	return function (scope, dispatcher, $interval) {
		
		var confirms = {};
		var scheduler = null;
		
		// Store Object 
        function ConfirmStore() {}
		// inherit from Store for events method
        ConfirmStore.prototype = new Store(scope, dispatcher)
		
		// get the history
        ConfirmStore.prototype.getConfirms = function() {
			return confirms;
		};
		
		var push = function(payload) {
            confirms.push({payload : payload, timestamp: moment()})
		};
		
		var confirm = function() {
            confirms.shift();
		};
		
		var cancelScheduler = function(){
			$interval.cancel(scheduler)
		};
		var startScheduler = function(){
			scheduler = $interval(store.emitChange(), 60000);
		};


		// Create instance
        var store = new ConfirmStore();
		
		// bind to dispatcher
		store.bind(constants.CONFIRM_OK, function(payload, ec) {
            var defer = confirms[payload.id];
            defer.resolve();
            delete confirms[payload.id];
            store.emitChange()();
        }).bind(constants.CONFIRM_CANCEL, function(payload, ec) {
            var defer = confirms[payload.id];
            defer.reject();
            delete confirms[payload.id];
            store.emitChange()();
        }).bind(constants.PROJECT_DESTROY, function(payload, ec ) {
            console.info("Ask confirm before project destroy")
            var defer = ec.defer();
            confirms[payload.id] = {
                defer : defer,
                timestamp : moment(),
                payload : payload
            };
            store.emitChange()();
			return defer.promise
        });
		
		
       
		console.info("Loading ConfirmStore Service " + store.id)
        return store;
	}
})
