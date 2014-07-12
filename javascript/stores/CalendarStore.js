/*
 * This store help to manage time view.
 * It store the start date or the time view
 * and let move by up and down on quarter base
 */


define([ "dispatcher/AppDispatcher", "stores/Store", "constants/ProjectContants"],
    function( dispatcher, Store, constants) {

        /*
         * Here we define the CalendarStore class
         */

        // init the start date to the begining of the current year
        var calendar = undefined;

        // This store inherit from Store
        function CalendarStore() {}
        CalendarStore.prototype = new Store();

        // Simple accessor use by components for read the calendar Id
        CalendarStore.prototype.getCalendar = function() {
            return calendar
        };

        var setCalendar = function(id) {
            return function() { 
                calendar = id;
                console.log(calendar)

                return true; // needed fo dispatcher
            }
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


        // register the callbacks
        dispatcher.registerCallbacks(callbacks);

        return store
    });
