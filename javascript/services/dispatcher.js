define([], function () {

    /**
     * Factory definition for the dispatcher service
     */
    return function ($rootScope, $q) {

        /**
         * Dispatcher will be a singleton so we manage internal data outside his api.
         *
         */

        var _callbacks = [];
        var _recovers = [];

        /**
         * Execution context is create each time dispatcher run dispatch method
         * It store the complete execution stack
         *
         * The instance is pass to the callbacks so we can manipulate the execution
         * workflow
         *
         * @constructor
         */
        function ExecutionContext() {
            this.promises = [];
        }

        /**
         * Create the list of promise to execute from the callback register in  the dispatcher
         * {@see Dispatcher.register}
         *
         * @param payload
         * @param callbacks
         * @returns {Array}
         */
        ExecutionContext.prototype.run = function(/* Array */ callbacks, /* object */ payload) {
            var self = this;
            callbacks.forEach(function(callback) {
                var promise = $q.when(callback(payload, self));
                self.promises.push(promise);
            });
            return self.promises
        };

        /**
         * Create the list of promise to execute from the callback register with the
         * {@see Dispatcher.waitForError} method of the dispatcher
         *
         * @param payload
         * @returns {function}
         */
        ExecutionContext.prototype.recover = function(/* Array */recovers, /* object */ payload) {
            return function(reason) {
                var _recoverPromises = [];
                recovers.forEach(function (/* function */ callback) {
                    _recoverPromises.push($q.when(callback(payload, reason)));
                });
                if (_recoverPromises.length > 0) {
                    return $q.all(_recoverPromises)
                } else {
                    return $q.reject(reason)
                }
            }
        };

        /**
         * Allow to make a callback wait for the execution of another callback
         *
         *  // registering callback with an execution dependency
         *  var index1 = dispatcher.register(function() { return 1 });
         *  var index2 = dispatcher.register(function(payload , ec) {
         *      return ec.waitFor([index1]).then(function() { return 2 });
         *  });
         *
         * // on execution callback 1 is execute before callback 2
         * // if callback 1 is a promise that fail, callback2 is not executed
         * dispatcher.dispatch(true)
         *
         * @param promiseIndexes
         * @returns {Promise}
         */
        ExecutionContext.prototype.waitFor = function(/* Array */ promiseIndexes) {
            var self = this;
            var selectedPromises = [];
            promiseIndexes.forEach(function(index) {
                selectedPromises.push(self.promises[index]);
            });
            return $q.all(selectedPromises);
        };

        /**
         * Here is the dispatcher API
         *
         * First the main API
         *
         */

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
         * this method execute a dispatch. It execute all registered callback.
         * It return a promise that resolve an array of all result of all callback
         *
         * If a callback return a promise and if this promise fail, the dispatch
         * will try to use the {@see waitForError} callbacks to recover the error
         *
         * @param payload
         * @returns {promise}
         */
	    Dispatcher.prototype.dispatch = function(/* object */ payload) {
			console.debug("Dispatch started");
            var self = this;
            var ec = new ExecutionContext();

			return $q.all(ec.run(_callbacks, payload))
            .catch(ec.recover(_recovers, payload))
			.then(function(data){
				console.debug("Dispatch completed");
				return data;
			}).catch(function(err) {
				console.debug("Dispatch failed");
				return self.fail(err)
			})
	    };


        /**
         * Here the helpers API.
         * This method helps to create callback.
         * The main things is to provide a scheduling feature by using
         * the promise API.
         *
         * When {@see dispatch} is run all callback are converted to promise if necessary
         * so we can use it for providing basic dependencies management between
         * callbacks even for async callback process
         */






	    
	    // Helper for creating a deferred that always resolve
	    Dispatcher.prototype.noop = function(value) { 
			var d = $q.defer();
			d.resolve(value);
			return d.promise
		};
	    // Helper for creating a deferred that always reject
	    Dispatcher.prototype.fail = function(value) { 
			var d = $q.defer();
			d.reject(value);
			return d.promise
		};

        /**
         * this method return a promise
         * whatever the given parameter is a value or a promise
         * @param v
         * @returns {Promise}
         */
        Dispatcher.prototype.when = function(v) {
            return $q.when(v)
        };




        console.info("Loading Dispatcher Service")
		
		
		var dispatcher = new Dispatcher()
		
		$rootScope.$on("dispatcher", function(event, /* string */ actionType, /* object */ payload ) {
			payload = payload || {};
			payload.actionType = actionType;
            dispatcher.dispatch(payload).catch(function(err) { console.warn(err) });
		});
		
		
        return dispatcher;
    };
});