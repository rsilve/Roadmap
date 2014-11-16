define([
    'stores/Store',
	'services/Constants',
	'moment'
], function (Store, constants, moment) {

	/**
	 * Factory definition for the TimeStore service
	 */
	return function (scope, dispatcher, ProjectStore) {

		// init the history data
		var history = [];

		/**
		 * Constructor of the HistoryStore
		 * This service manage the history list across application
		 * @constructor
		 */
        function HistoryStore() {}
		HistoryStore.prototype = new Store(scope, dispatcher);

		/**
		 * Get the history
		 * @returns {Array}
		 */
		HistoryStore.prototype.getHistory = function() {
			return history;
		};

		/**
		 * Get the last item history
		 * @returns {T}
		 */
		HistoryStore.prototype.last = function() {
			return history.slice(0,1).shift();
		};

		/**
		 * helper to add an item in history
		 * @param payload
		 * @returns {Function}
		 */
		var push = function(payload) {
			return function() { 
				history.unshift({payload : payload, timestamp: moment()}) 
			}
		};

		/**
		 * helper to remove last item history on undo action
		 */
		var undo = function() {
			history.shift();
		};

		/*
		 * here whe create an instance of the store
		 * and we register some actions in the dispatcher
		 */
        var store = new HistoryStore();
		
		store.bind(constants.PROJECT_SAVE, function(payload, ec) {
			return ec.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_SAVE]]).
			then(push(payload))
        }).bind(constants.PROJECT_DESTROY, function(payload, ec ) {
			return ec.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_DESTROY]])
			.then(push(payload))
        }).bind(constants.UNDO, function(payload, ec) {
			ec.waitFor([ProjectStore.dispatchIndex[constants.UNDO]])
				.then(undo)
        });
		
		
       
		console.info("Loading HistoryStore Service " + store.id);
        return store;
	}
});
