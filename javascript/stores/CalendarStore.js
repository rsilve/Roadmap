define([
    'stores/Store',
    'Constants'
], function (Store, constants) {

    return function (scope, dispatcher, google) {
        /*
         * Here we define the CalendarStore class
         */

        // init the calendar chooser
        var calendar = undefined;
        var calendarList = [];


        // This store inherit from Store
        function CalendarStore() {}
        CalendarStore.prototype = new Store(scope, dispatcher);

        // Simple accessor use by components for read the calendar Id
        CalendarStore.prototype.getCalendar = function() {
            return calendar
        };
        // Simple accessor use by components for read the calendarList
        CalendarStore.prototype.getCalendarList = function() {
            return calendarList
        };

        // helper for setting calendarList
        var setCalendarList = function(data) {
            calendarList = data.items;
        };

        // helper for choosing a calendar in dispatcher
        var setCalendar = function(id) {
			console.info("Choose calendar " + id)
            calendar = id;
        };

        // helper for reseting  calendar in dispatcher
        var resetCalendar = function() {
			console.info("Unselect calendar")
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
        })
		
        // finally do some call for init
        google().calendarList()
		.then(setCalendarList)
		.then(store.emitChange())
		.catch(function(err) { console.log(err) });
		
        console.info("Loading CalendarStore Service "+store.id)
		
        return store;
    };
});