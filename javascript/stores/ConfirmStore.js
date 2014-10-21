define([
    'angular',
    'stores/Store',
	'services/Constants',
	'moment'
], function (angular, Store, constants, moment) {
	
	return function (scope, dispatcher, $interval) {
		
		var confirms = {};
		var scheduler = null;
		
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
		

		var cancelScheduler = function(){
			$interval.cancel(scheduler)
		};
		var startScheduler = function(){
			scheduler = $interval(store.emitChange(), 60000);
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



        // Create instance
        var store = new ConfirmStore();
		
		// bind to dispatcher
		store.bind(constants.CONFIRM_OK, function(payload, ec) {
            payload.defer.resolve();
            delete confirms[payload.id];
            store.emitChange()();
        }).bind(constants.CONFIRM_CANCEL, function(payload, ec) {
            payload.defer.reject();
            delete confirms[payload.id];
            store.emitChange()();
        }).bind(constants.PROJECT_DESTROY, function(payload, ec ) {
            console.info("Ask confirm before project destroy");
            var defer = ec.defer();
            var id = guid();
            confirms[id] = {
                id : id,
                defer : defer,
                timestamp : moment(),
                payload : payload
            };
            store.emitChange()();
			return defer.promise
        }).bind(constants.SET_CALENDAR, function(payload) {
            angular.forEach(confirms, function(v, k) {
                v.defer.reject();
                delete confirms[v.id];
            });
        });
		
		
       
		console.info("Loading ConfirmStore Service " + store.id)
        return store;
	}
});
