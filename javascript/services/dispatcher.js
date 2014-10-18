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
        var _promises = [];


        // helper factory for error recovery callback
        var recover = function(payload) {
            return function (reason) {
                var _recoverPromises = [];
                _recovers.forEach(function (/* function */ callback) {
                    _recoverPromises.push($q.when(callback(payload, reason)));
                });
                if (_recoverPromises.length > 0) {
                    return $q.all(_recoverPromises)
                } else {
                    return $q.reject(reason)
                }

            }
        };


        // helper : when an action is fired transform a callback in promise
        var _addPromise = function(callback, payload) {
            var promise = $q.when(callback(payload));
            _promises.push(promise);
        };

        // helper : before dispatch an action clear all promises
        var _clearPromises = function() {
            _promises = [];
            _recovers = [];
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
	        _clearPromises();
	        var self = this;
	        _callbacks.forEach(function(callback) {
	            _addPromise(callback, payload);
	        });
			return $q.all(_promises)
            .catch(recover(payload))
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


        /**
         * Allow to make a callback wait for the execution of another callback
         *
         *  // registering callback with an execution dependency
         *  var index1 = dispatcher.register(function() { return 1 });
         *  var index2 = dispatcher.register(function() {
         *      return dispatcher.waitFor([index1]).then(function() { return 2 });
         *  });
         *
         * // on execution callback 1 is execute before callback 2
         * // if callback 1 is a promise that fail, callback2 is not executed
         * dispatcher.dispatch(true)
         *
         * @param promiseIndexes
         * @returns {Promise}
         */
	    Dispatcher.prototype.waitFor = function(/* Array */ promiseIndexes) {
	        var selectedPromises = [];
	        promiseIndexes.forEach(function(index) {
	            selectedPromises.push(_promises[index]);
	        });
	        return $q.all(selectedPromises);
	    };



	    
	    // Helper for creating a deferred that always resolve
	    Dispatcher.prototype.noop = function(value) { 
			var d = $q.defer();
			d.resolve(value)
			return d.promise
		};
	    // Helper for creating a deferred that always reject
	    Dispatcher.prototype.fail = function(value) { 
			var d = $q.defer();
			d.reject(value)
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