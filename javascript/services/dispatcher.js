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
                    _recoverPromises.push($q.when(callback(payload)));
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
			return $q.all(_promises).catch(recover(payload))
			.then(function(data){
				console.debug("Dispatch completed");
				return data;
			}).catch(function(err) {
				console.debug("Dispatch failed");
				return self.fail(err)
			})
	    };


	    /**
	     * Allows a store to wait for the registered callbacks of other stores
	     * to get invoked before its own does.
	     * This function is not used by this TodoMVC example application, but
	     * it is very useful in a larger, more complex application.
	     *
	     * Example usage where StoreB waits for StoreA:
	     *
	     *   var StoreA = merge(EventEmitter.prototype, {
	   *     // other methods omitted
	   *
	   *     dispatchIndex: Dispatcher.register(function(payload) {
	   *       // switch statement with lots of cases
	   *     })
	   *   }
	     *
	     *   var StoreB = merge(EventEmitter.prototype, {
	   *     // other methods omitted
	   *
	   *     dispatchIndex: Dispatcher.register(function(payload) {
	   *       switch(payload.action.actionType) {
	   *
	   *         case MyConstants.FOO_ACTION:
	   *           Dispatcher.waitFor([StoreA.dispatchIndex], function() {
	   *             // Do stuff only after StoreA's callback returns.
	   *           });
	   *       }
	   *     })
	   *   }
	     *
	     * It should be noted that if StoreB waits for StoreA, and StoreA waits for
	     * StoreB, a circular dependency will occur, but no error will be thrown.
	     * A more robust Dispatcher would issue a warning in this scenario.
	     */
	    Dispatcher.prototype.waitFor = function(/*Array*/ promiseIndexes) {
	        var selectedPromises = [];
	        var self = this;
	        promiseIndexes.forEach(function(index) {
	            selectedPromises.push(_promises[index]);
	        });

	        return $q.all(selectedPromises);
	    };


	    // Allow a store to do something after an error occured
	    Dispatcher.prototype.waitForError = function( /* function */ callback) {
	        _recovers.push(callback)
			var d = $q.defer();
			d.resolve();
	        return d.promise;
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


        /**
	     * A bridge function between the views and the dispatcher, marking the action
	     * as a view action.  Another variant here could be handleServerAction.
	     * @param  {object} payload The data coming from the view.
	     */
	    Dispatcher.prototype.handleViewAction = function(/* object */ payload) {
	        return this.dispatch(payload).catch(function(err) { console.warn(err) })
	    };


        console.info("Loading Dispatcher Service")
		
		
		var dispatcher = new Dispatcher()
		
		$rootScope.$on("dispatcher", function(event, /* string */ actionType, /* object */ payload ) {
			payload = payload || {};
			payload.actionType = actionType;
            dispatcher.handleViewAction(payload);
		})
		
		
        return dispatcher;
    };
});