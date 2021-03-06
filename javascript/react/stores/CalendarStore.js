/*
 * This store help to manage time view.
 * It store the start date or the time view
 * and let move by up and down on quarter base
 */


define([ "dispatcher/AppDispatcher", "stores/Store", "constants/ProjectContants", "google"],
    function( dispatcher, Store, constants, google) {

        /*
         * Here we define the CalendarStore class
         */

        // init the calendar chooser
        var calendar = undefined;
        var calendarList = [];


        // This store inherit from Store
        function CalendarStore() {}
        CalendarStore.prototype = new Store();

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
                calendar = id;
                return true; // needed fo dispatcher
            }
        };

        // helper for reseting  calendar in dispatcher
        var resetCalendar = function() {
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
        google().calendarList().then(setCalendarList).then(store.emitChange());


            return store
    });
