/*
 * This store help to manage time view.
 * It store the start date or the time view
 * and let move by up and down on quarter base
 */


define(["momentjs", "dispatcher/AppDispatcher", "stores/Store", "constants/ProjectContants"],
    function(moment, dispatcher, Store, constants) {

        /*
         * Here we define the TimeStore class
         */

        // init the start date to the begining of the current year
        var start = moment().startOf('year');

        // This store inherit from Store
        function TimeStore() {}
        TimeStore.prototype = new Store();

        // Simple accessor use by components for read the time reference
        TimeStore.prototype.getStart = function() {
            return start
        };

        // helper go to next quarter
        TimeStore.prototype.next = function() {
            start.quarter(start.quarter() + 1);
            return true; // need for dispatcher
        };
        // helper go to previous quarter
        TimeStore.prototype.prev = function() {
            start.subtract("month", 3);
            return true; // need for dispatcher
        };

        /*
         * here whe create an instance of the store
         * and we register some actions in the dispatcher
         */

        var store = new TimeStore();
        var callbacks = {}
        // on next period action move to the next quarter
        callbacks[constants.TIME_NEXT_PERIOD] = function() {
            return dispatcher.defer(store.next).then(store.emitChange())
        };
        // on previous period action move to the previous quarter
        callbacks[constants.TIME_PREV_PERIOD] = function() {
           return dispatcher.defer(store.prev).then(store.emitChange());
        };

        // register and store the reference of this register
        // useful to use the wait feature of the dispatcher
        store.dispatchIndex = dispatcher.registerCallbacks(callbacks);

        return store
    });
