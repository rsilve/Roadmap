define([
    'stores/Store',
	'Constants',
	'moment'
], function (Store, constants, moment) {

	
    return function ($scope, dispatcher) {
		
	    // init the start date to the begining of the current year
	    var start = moment().startOf('year');
			
		// Store Object 
        function TimeStore() {}
		// inherit from Store for events method
        TimeStore.prototype = new Store($scope, dispatcher)
		
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
		store.bind(constants.TIME_NEXT_PERIOD, function() {
			// on next period action move to the next quarter
			return dispatcher.defer(next)
        }).bind(constants.TIME_PREV_PERIOD, function() {
			// on previous period action move to the previous quarter
			return dispatcher.defer(prev)
        })
		
       
		console.info("Loading TimeStore Service " + store.id)
        return store;
    };
});