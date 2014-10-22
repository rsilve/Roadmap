define([
    'stores/Store',
    'services/Constants'
], function (Store, constants) {


    /**
     * Factory definition for the TimeStore service
     */
    return function (scope, dispatcher, google) {

        // init the calendars data
        var calendar;
        var calendarList = [];


        /**
         * Contructor of the calendarStore
         * This service manage the working calendar across application
         * @constructor
         */
        function CalendarStore() {}
        CalendarStore.prototype = new Store(scope, dispatcher);

        /**
         * Get the working calendar
         * @returns {String}
         */
        CalendarStore.prototype.getCalendar = function() {
            return calendar
        };

        /**
         * Get the calendars list use for choose the working calendar
         * @returns {Array}
         */
        CalendarStore.prototype.getCalendarList = function() {
            return calendarList
        };

        /**
         * Helper for setting calendar list from the result of a google call
         * @param data
         */
        var setCalendarList = function(data) {
            console.info("Setting calendar list");
            calendarList = data.items;
        };

        /**
         * Helper for setting the current calendar
         * @param id
         */
        var setCalendar = function(id) {
			console.info("Choose calendar " + id);
            calendar = id;
        };

        /**
         * Helper for unset the working calendar
         */
        var resetCalendar = function() {
			console.info("Unselect calendar");
            calendar = undefined;
        };


        /*
         * here whe create an instance of the store
         * and we register some actions in the dispatcher
         */

        var store = new CalendarStore();
		store.bind(constants.SET_CALENDAR, function(payload) {
			return setCalendar(payload.calendar)
        }).bind(constants.RESET_CALENDAR, function(payload) {
			return resetCalendar()
        });


        // finally do some call for init
        google().calendarList()
		.then(setCalendarList)
		.then(store.emitChange())
		.catch(function(err) { console.warn(err) });
		
        console.info("Loading CalendarStore Service "+store.id);
		
        return store;
    };
});