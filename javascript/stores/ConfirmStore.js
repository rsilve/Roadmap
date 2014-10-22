define([
    'angular',
    'stores/Store',
	'services/Constants',
	'moment'
], function (angular, Store, constants, moment) {
	
	return function (scope, dispatcher) {
		
		var confirms = {};

		// Store Object
        function ConfirmStore() {}
		// inherit from Store for events method
        ConfirmStore.prototype = new Store(scope, dispatcher);
		
		// get the history
        ConfirmStore.prototype.getConfirms = function() {
            var array = [];
            angular.forEach(confirms, function(v, k) {
                array.push(v)
            });
			return array;
		};
		

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
            return defer.promise
        };

        var validConfirm = function(payload) {
            payload.defer.resolve();
            delete confirms[payload.id];
            store.emitChange()();
        };

        var rejectConfirm = function(payload) { 
            payload.defer.reject();
            delete confirms[payload.id];
        };

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
		
		console.info("Loading ConfirmStore Service " + store.id)
        return store;
	}
});
