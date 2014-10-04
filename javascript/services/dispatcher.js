define([], function () {

    return function ($q) {
		// Base object dispatcher
	    function Dispatcher() {
	        this._callbacks = [];
	        this._recovers = [];
	        this._promises = [];
	        this._recoverPromises = [];
	    }

	    // method for registering callback from the stores
	    Dispatcher.prototype.register =  function(callback) {
	        this._callbacks.push(callback);
	        return this._callbacks.length - 1; // index
	    };

	    // helper factory for error recovery callback
	    var recover = function(self, payload) {
	        return function (reason) {
	            self._recovers.forEach(function (callback) {
	                self._addPromiseRecover(callback, reason, payload);
	            });
	            if (self._recoverPromises.length > 0) {
	                return $q.all(self._recoverPromises)
	            } else {
	                return $q.reject(reason)
	            }

	        }
	    };
	    // method for dispatch an action to the stores
	    Dispatcher.prototype.dispatch = function(payload) {
	        this._clearPromises();
	        var self = this;
	        this._callbacks.forEach(function(callback) {
	            self._addPromise(callback, payload);
	        });
	        return $q.all(this._promises).catch(recover(self, payload))
	    };




	    // helper : when an action is fired transform a callback in promise
	    Dispatcher.prototype._addPromise = function(callback, payload) {
	        var promise = callback(payload);
	        this._promises.push(promise);
	    };

	    // helper : transform a callback in promise that will be use to recover after
	    // failed process
	    Dispatcher.prototype._addPromiseRecover = function(callback, payload) {
			var deferred = $q.defer();
            if (callback(payload)) {
                rdeferred.esolve(payload);
            } else {
                deferred.reject(new Error('Dispatcher callback unsuccessful'));
            }
	        this._recoverPromises.push(deferred.promise);
	    };

	    // helper : before dispatch an action clear all promises
	    Dispatcher.prototype._clearPromises = function() {
	        this._promises = [];
	        this._recovers = [];
	        this._recoverPromises = [];

	    };

	    // helper : clear all callback registered (for testing purpose)
	    Dispatcher.prototype.clearAll = function() {
	        this._callbacks = [];
	        this._recovers = [];
	        this._promises = [];
	        this._recoverPromises = [];
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
	        var self = this
	        promiseIndexes.forEach(function(index) {
	            selectedPromises.push(self._promises[index]);
	        });

	        return $q.all(selectedPromises);
	    };


	    // Allow a store to do something after an error occured
	    Dispatcher.prototype.waitForError = function( /*function*/ callback) {
	        this._recovers.push(callback)
	        return $q.resolve();
	    };

	    // Allow a store to create a deferred process
	    // callback must return true (for resolve) or false (to reject)
	    Dispatcher.prototype.defer = function(/*function*/ callback) {
			var deferred = $q.defer();
            if (callback()) {
                deferred.resolve(true);
            } else {
                deferred.reject(new Error('Dispatcher callback unsuccessful'));
            }
	        return deferred.promise
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
	     * A bridge function between the views and the dispatcher, marking the action
	     * as a view action.  Another variant here could be handleServerAction.
	     * @param  {object} action The data coming from the view.
	     */
	    Dispatcher.prototype.handleViewAction = function(/* object */ action) {
	        return this.dispatch(action).catch(function(err) { console.warn(err) })
	    };

	    // helper for register map of callbacks
	    /* var callbacks = {
	     *     action1 : function(payload) {
	     *      return disaptcher.defer(...) // a classic action encapsulate in defer
	     *    },
	     *    action2 : function(payload) {
	     *      return $.ajax(..) // async action
	     *    }
	     * }
	     * dispatcher.registerCallbacks(callbacks)
	     */
	    Dispatcher.prototype.registerCallbacks = function(callbacks) {
	        var self = this;
	        return this.register(function(payload) {
	            if (callbacks[payload.actionType]) {
	                return callbacks[payload.actionType](payload)
	            } else
	                return self.noop();
	        })
	    };
		
        console.info("Loading Dispatcher Service")
        return new Dispatcher()
    };
});