define([], function () {

    return function ($rootScope, $q) {
		
		
		// Base object dispatcher
	    function Dispatcher() {
	        this._callbacks = [];
	        this._recovers = [];
	        this._promises = [];
	        this._recoverPromises = [];
	    }
		
		Dispatcher.prototype.when = function(v) {
			return $q.when(v)
		}

	    // method for registering callback from the stores
	    Dispatcher.prototype.register =  function(/* function */ callback) {
	        this._callbacks.push(callback);
	        return this._callbacks.length - 1; // index
	    };

	    // helper factory for error recovery callback
	    var recover = function(self, payload) {
	        return function (reason) {
	            self._recovers.forEach(function (/* function */ callback) {
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
	    Dispatcher.prototype.dispatch = function(/* object */ payload) {
			console.debug("Dispatch started")
	        this._clearPromises();
	        var self = this;
	        this._callbacks.forEach(function(callback) {
	            self._addPromise(callback, payload);
	        });
			return $q.all(this._promises).catch(recover(self, payload))
			.then(function(data){
				console.debug("Dispatch completed");
				return data;
			}).catch(function(err) {
				console.debug("Dispatch failed");
				return self.fail(err)
			})
	    };




	    // helper : when an action is fired transform a callback in promise
	    Dispatcher.prototype._addPromise = function(callback, payload) {
	        var promise = callback(payload);
	        this._promises.push(promise);
	    };

	    // helper : transform a callback in promise that will be use to recover after
	    // failed process
	    Dispatcher.prototype._addPromiseRecover = function(callback, payload) {
			var promise = callback(payload)
            this._recoverPromises.push(promise);
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
	    Dispatcher.prototype.waitForError = function( /* function */ callback) {
	        this._recovers.push(callback)
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