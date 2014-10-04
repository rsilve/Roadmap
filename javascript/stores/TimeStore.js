define([
    'stores/Store',
	'Constants',
	'momentjs'
], function (Store, constants, moment) {

	
    return function ($scope, dispatcher) {
		
	    // init the start date to the begining of the current year
	    var start = moment().startOf('year');
			
		// Store Object 
        function TimeStore() {}
		// inherit from Store for events method
        TimeStore.prototype = new Store($scope)
		
		// get the projects list
        TimeStore.prototype.getProjects = function() {
        	return getProjects();
        }
		
        // Simple accessor use by components for read the time reference
        TimeStore.prototype.getStart = function() {
            return start
        };

        // helper go to next quarter
        var next = function() {
            start.quarter(start.quarter() + 1);
            return true; // need for dispatcher
        };
        // helper go to previous quarter
        var prev = function() {
            start.subtract("month", 3);
            return true; // need for dispatcher
        };

        /*
         * here whe create an instance of the store
         * and we register some actions in the dispatcher
         */

		// Store instance
        var store = new TimeStore();
		var callbacks = {}
        // on next period action move to the next quarter
        callbacks[constants.TIME_NEXT_PERIOD] = function() {
            return dispatcher.defer(next).then(store.emitChange())
        };
        // on previous period action move to the previous quarter
        callbacks[constants.TIME_PREV_PERIOD] = function() {
           return dispatcher.defer(prev).then(store.emitChange());
        };

        // register and store the reference of this register
        // useful to use the wait feature of the dispatcher
        store.dispatchIndex = dispatcher.registerCallbacks(callbacks);
		
		console.info("Loading TimeStore Service " + store.id)
        return store;
    };
});