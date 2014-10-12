define([
    'stores/Store',
	'Constants',
	'moment'
], function (Store, constants, moment) {

	// helper for compute month list
	var updateMonths = function(start) {
		var z = []
		for (var i = 0; i < 24; i ++) {
			// $scope.start is a momentjs
            var d = start.clone().add(i, "month");
			var month = { label : d.format("MMM") }
			if (d.month() == 0) {
                month.label = d.format("MMM YYYY");
                month.meta += " startyear"
            }
            if (d.month() % 3 == 0) {
                month.label = d.format("MMM YYYY");
                month.meta += " quarter"
            }
		
           z.push(month );
        }
		return z;
	}

	
    return function (scope, dispatcher) {
		
	    // init the start date to the begining of the current year
	    var start = moment().startOf('year');
		var months = updateMonths(start);	
		
		// Store Object 
        function TimeStore() {}
		// inherit from Store for events method
        TimeStore.prototype = new Store(scope, dispatcher)
		
        // Simple accessor use by components for read the time reference
        TimeStore.prototype.getStart = function() {
            return start
        };
        // Simple accessor use by components for read the months list
        TimeStore.prototype.getMonths = function() {
            return months
        };
       
		
        // helper go to next quarter
        var next = function() {
			start.quarter(start.quarter() + 1);
			months = updateMonths(start);
			console.info("Time base move to ", start)
            return true; // need for dispatcher
        };
        // helper go to previous quarter
        var prev = function() {
            start.subtract(3, "month");
			months = updateMonths(start);
			console.info("Time base move to ", start)
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