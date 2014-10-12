define([
    'stores/Store',
	'Constants',
	'moment'
], function (Store, constants, moment) {

	var ZOOM_DAYS = "day";
	var ZOOM_WEEKS = "week";
	var ZOOM_MONTHS = "month";
	
    
	// helper for compute month list
	var updateTicks = function(/* moment */ start, /* string */ zoom) {
		var z = []
		for (var i = 0; i < 24; i ++) {
			var d = start.clone().add(i, zoom).startOf(zoom);
			var month = { label : d.format("DD/MM") }
			if (zoom === ZOOM_MONTHS) {
				month.label = d.format("MMM");
				if (d.month() == 0) {
	                month.label = d.format("MMM YYYY");
	                month.meta += " startyear"
	            }
	            if (d.month() % 3 == 0) {
	                month.label = d.format("MMM YYYY");
	                month.meta += " quarter"
	            }
			}
			if (zoom === ZOOM_WEEKS) {
				if (d.date() < 7) {
	                month.label = d.format("DD/MM/YY");
					if (d.month() == 0) 
	                	month.meta += " startyear"
	            }
	           
			}
			if (zoom === ZOOM_DAYS) {
				if (d.date() === 1) {
	                month.label = d.format("DD/MM/YY");
					if (d.month() == 0) 
	                	month.meta += " startyear"
	            }
	           
			}
			
		
           z.push(month );
        }
		return z;
	}

	return function (scope, dispatcher) {
		
	    // init the start date to the begining of the current year
	    var start = moment().startOf('year');
		var zoom = ZOOM_MONTHS;
		var ticks = updateTicks(start, zoom);	
		
		// Store Object 
        function TimeStore() {}
		// inherit from Store for events method
        TimeStore.prototype = new Store(scope, dispatcher)
		
        // Simple accessor use by components for read the time reference
        TimeStore.prototype.getStart = function() {
            return start
        };
        // Simple accessor use by components for read the months list
        TimeStore.prototype.getTicks = function() {
            return ticks
        };
       
        TimeStore.prototype.getZoom = function() {
            return zoom;
        };
       
		
        // helper go to next quarter
        var next = function() {
			start.quarter(start.quarter() + 1);
			ticks = updateTicks(start, zoom);
			console.info("Time base move to ", start)
            return true; // need for dispatcher
        };
        // helper go to previous quarter
        var prev = function() {
            start.subtract(3, "month");
			ticks = updateTicks(start, zoom);
			console.info("Time base move to ", start)
            return true; // need for dispatcher
        };
        
        var setZoom = function(z) {
			return function(){
				zoom = z
				ticks = updateTicks(start, zoom);
				console.info("Time base zoom to ", z)
	            return true; // need for dispatcher
			}
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
        }).bind(constants.TIME_DAYS, function() {
			return dispatcher.defer(setZoom(ZOOM_DAYS))
        }).bind(constants.TIME_WEEKS, function() {
			return dispatcher.defer(setZoom(ZOOM_WEEKS))
        }).bind(constants.TIME_MONTHS, function() {
			return dispatcher.defer(setZoom(ZOOM_MONTHS))
        })
		
       
		console.info("Loading TimeStore Service " + store.id)
        return store;
    };
});