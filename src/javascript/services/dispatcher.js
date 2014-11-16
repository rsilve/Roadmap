define([], function () {

    /**
     * Factory definition for the dispatcher service
     */
    return function ($rootScope, $q, ExecutionContext) {

        /**
         * Dispatcher will be a singleton so we manage internal data outside his api.
         *
         */

        var _callbacks = [];
        var _recovers = [];


        /**
         * Base constructor for the dispatcher
         * @constructor
         */
	    function Dispatcher() {}


        /**
         * this method let the dispatcher register a callback function
         * that will be execute on disptach operation.
         * This method return the index position in the
         * register internal array. So you can store this
         * index when registering a callback, for use with the {@see waitFor} method
         *
         * registered callback could return a simple value or a promise
         *
         * @param callback
         * @returns {number}
         */
	    Dispatcher.prototype.register =  function(/* function */ callback) {
	        _callbacks.push(callback);
	        return _callbacks.length - 1;
	    };

        /**
         * This method allow to register a callback to recover {@see dispatch} failed execution
         * @param callback
         * @returns {*}
         */
        Dispatcher.prototype.waitForError = function( /* function */ callback) {
            _recovers.push(callback);
        };

        /**
         * this method run an execution. It execute all registered callback.
         * It return a promise that resolve an array of all result of all callback
         *
         * If a callback return a promise and if this promise fail, the dispatch
         * will try to use the {@see waitForError} callbacks to recover the error
         *
         * @param payload
         * @returns {promise}
         */
	    Dispatcher.prototype.run = function(/* object */ payload) {
			var ec = new ExecutionContext();
			console.debug("Run started " + ec.id);
			return ec.run(_callbacks, payload)
            .catch(ec.recover(_recovers, payload))
			.then(function(data){
				console.debug("Run completed "+ec.id);
				return data;
			}).catch(function(err) {
				console.debug("Run failed "+ec.id);
				return ec.fail(err)
			})
	    };


        console.info("Loading Dispatcher Service");
		
		
		var dispatcher = new Dispatcher();
		
		$rootScope.$on("dispatcher", function(event, /* string */ actionType, /* object */ payload ) {
			payload = payload || {};
			payload.actionType = actionType;
			console.debug("Run started for "+actionType);
			dispatcher.run(payload).catch(function(err) { console.warn(err) });
		});
		
		
        return dispatcher;
    };
});