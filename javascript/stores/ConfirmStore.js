define([
    'angular',
    'stores/Store',
	'services/Constants',
	'moment'
], function (angular, Store, constants, moment) {


    /**
     * Factory definition for the ConfirmStore service
     */
	return function (scope, dispatcher) {
		
		var confirms = {};

        /**
         * Constructor of the ConfirmStore service
         * This service manage all confirmation
         * It pause project remove action for wait user confirmation.
         * Then restart of reject the action
         *
         * @constructor
         */
        function ConfirmStore() {}
		ConfirmStore.prototype = new Store(scope, dispatcher);

        /**
         * method for getting the list of pending confirm
         * @returns {Array}
         */
        ConfirmStore.prototype.getConfirms = function() {
            var array = [];
            angular.forEach(confirms, function(v, k) {
                array.push(v)
            });
			return array;
		};

        /**
         * helper for generate a confirm ID
         */
        var guid = (function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
        })();

        /**
         * Helper for register a confirm
         * This method return an unresolved promise.
         * This intend to pause the current action
         * for wait user confirmation
         *
         * @param payload
         * @param ec
         * @returns {*}
         */
        var askConfirm = function(payload, ec) {
            console.info("Ask confirm before project destroy");
            var defer = ec.defer();
            var id = guid();
            confirms[id] = {
                id : id,
                defer : defer,
                timestamp : moment(),
                payload : payload
            };
            store.emitChange()()
            return defer.promise
        };

        /**
         * helper for resolv a confirm.
         *
         * @param payload
         */
        var validConfirm = function(payload) {
            payload.defer.resolve();
            delete confirms[payload.id];
            store.emitChange()();
        };

        /**
         * helper for reject a confirm
         * @param payload
         */
        var rejectConfirm = function(payload) { 
            payload.defer.reject();
            delete confirms[payload.id];
        };

        /**
         * Reject all pending confirm
         */
        var rejectAll = function() {
            angular.forEach(confirms, function(v, k) {
                v.defer.reject();
                delete confirms[v.id];
            });
        };

        // Create instance
        var store = new ConfirmStore();
		
		// bind to dispatcher
		store.bind(constants.CONFIRM_OK, function(payload, ec) {
            return validConfirm(payload);
        }).bind(constants.CONFIRM_CANCEL, function(payload, ec) {
            return rejectConfirm(payload);
        }).bind(constants.PROJECT_DESTROY, function(payload, ec ) {
            return askConfirm(payload, ec);
        }).bind(constants.SET_CALENDAR, function(payload, ec) {
            return rejectAll();
        });
		
		console.info("Loading ConfirmStore Service " + store.id);
        return store;
	}
});
