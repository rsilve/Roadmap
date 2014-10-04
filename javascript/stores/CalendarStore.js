define([
    'stores/Store',
    'Constants'
], function (Store, constants) {

    return function ($scope, dispatcher, google) {
        /*
         * Here we define the CalendarStore class
         */

        // init the calendar chooser
        var calendar = undefined;
        var calendarList = [];


        // This store inherit from Store
        function CalendarStore() {}
        CalendarStore.prototype = new Store($scope);

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
            return function() {
				console.debug("Choose calendar " + id)
                calendar = id;
                return true; // needed fo dispatcher
            }
        };

        // helper for reseting  calendar in dispatcher
        var resetCalendar = function() {
			console.debug("Unselect calendar")
            calendar = undefined;
            return true; // needed fo dispatcher
        };


        /*
         * here whe create an instance of the store
         * and we register some actions in the dispatcher
         */



        var store = new CalendarStore();
        var callbacks = {};
        callbacks[constants.SET_CALENDAR] = function(action) {
            return dispatcher.defer(setCalendar(action.id)).then(store.emitChange())
        };
        callbacks[constants.RESET_CALENDAR] = function(action) {
            return dispatcher.defer(resetCalendar).then(store.emitChange())
        };

        // register the callbacks
        dispatcher.registerCallbacks(callbacks);

        // finally do some call for init
        google().calendarList()
		.then(setCalendarList)
		.then(function() { store.emitChange() })
		.catch(function(err) { console.log(err) });
		
        console.info("Loading CalendarStore Service "+store.id)
		
        return store;
    };
});