define([
    'stores/Store',
	'services/Constants',
	'moment'
], function (Store, constants, moment) {

	var ZOOM_DAYS = "day";
	var ZOOM_WEEKS = "week";
	var ZOOM_MONTHS = "month";
	
    var ticksFormat = {};
    ticksFormat[ZOOM_MONTHS] = function(d, tick) {
		tick.label = d.format("MMM");
		if (d.month() == 0) {
            tick.label = d.format("MMM YYYY");
            tick.meta += " startyear"
        }
        if (d.month() % 3 == 0) {
            tick.label = d.format("MMM YYYY");
            tick.meta += " quarter"
        }
	};
	ticksFormat[ZOOM_WEEKS] = function(d, tick) {
		if (d.date() < 7) {
            tick.label = d.format("DD/MM/YY");
			if (d.month() == 0) 
            	tick.meta += " startyear"
        }
	};
	ticksFormat[ZOOM_DAYS] = function(d, tick) {
		if (d.date() === 1) {
            tick.label = d.format("DD/MM/YY");
			if (d.month() == 0) 
            	tick.meta += " startyear"
        }
	};
	
	// helper for compute tick list
	var updateTicks = function(/* moment */ start, /* string */ zoom) {
		var z = [];
		for (var i = 0; i < 24; i ++) {
			var d = start.clone().add(i, zoom).startOf(zoom);
			var tick = { label : d.format("DD/MM"), date: d }
			ticksFormat[zoom](d, tick);
            z.push(tick );
        }
		return z;
	};

    /**
     * Factory definition for the TimeStore service
     */
	return function (scope, dispatcher) {
		
	    // init the start date to the begining of the current year
	    var start = moment().startOf('year');
		var zoom = ZOOM_MONTHS;
		var ticks = updateTicks(start, zoom);

        /**
         * Constructor of the TimeStore
         * This service intend to manage the time view of the application
         *
         * @constructor
         */
        function TimeStore() {}
        TimeStore.prototype = new Store(scope, dispatcher);

        /**
         * get start date that will be use as reference fo the time view
         * @returns {*}
         */
        TimeStore.prototype.getStart = function() {
            return start
        };

        /**
         * get the time ticks that will be display by the time view
         *
         * @returns {Array}
         */
        TimeStore.prototype.getTicks = function() {
            return ticks
        };

        /**
         * get the scale of the time view
         * @returns {string}
         */
        TimeStore.prototype.getZoom = function() {
            return zoom;
        };

        /**
         * helper to update the start date reference base on the current scale
         */
        var next = function() {
            if (zoom === ZOOM_MONTHS)
                start.add(3, 'months');
            if (zoom === ZOOM_WEEKS)
                start.add(1, 'months');
            if (zoom === ZOOM_DAYS)
                start.add(1, 'weeks');
            ticks = updateTicks(start, zoom);
			console.info("Time base move to ", start.toString())
        };

        /**
         * helper to update the start date reference base on the current scale
         */
        var prev = function() {
            if (zoom === ZOOM_MONTHS)
                start.subtract(3, 'months');
            if (zoom === ZOOM_WEEKS)
                start.subtract(1, 'months');
            if (zoom === ZOOM_DAYS)
                start.subtract(1, 'weeks');
            ticks = updateTicks(start, zoom);
			console.info("Time base move to ", start.toString())
        };

        /**
         * helper to update the ticks  base on the given scale
         */
        var setZoom = function(z) {
			zoom = z;
			ticks = updateTicks(start, zoom);
			console.info("Time base zoom to ", z)
        };
		
        /*
         * here whe create an instance of the store
         * and we register some actions in the dispatcher
         */

		// Store instance
        var store = new TimeStore();
		store.bind(constants.TIME_NEXT_PERIOD, function() {
			// on next period action move to the next quarter
			return next()
        }).bind(constants.TIME_PREV_PERIOD, function() {
			// on previous period action move to the previous quarter
			return prev()
        }).bind(constants.TIME_DAYS, function() {
			return setZoom(ZOOM_DAYS)
        }).bind(constants.TIME_WEEKS, function() {
			return setZoom(ZOOM_WEEKS)
        }).bind(constants.TIME_MONTHS, function() {
			return setZoom(ZOOM_MONTHS)
        });

		console.info("Loading TimeStore Service " + store.id);
        return store;
    };
});