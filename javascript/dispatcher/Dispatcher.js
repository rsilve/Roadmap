
/*
 * This module define a dispatcher
 * A dispatcher mainly *register* callback from stores
 * When an action is fired, it is send to ALL callback.
 * If the callback know something about the action type it can do something
 *
 * The processing of action is sequential :
 * action are receive and dispatch one by one by only ONE dispatcher in the app.
 * When dispatched, the process could be async because all callback are transform in
 * promises
 */


(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["when"], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var when = require("when")
        module.exports = factory(when)
    } else {
        // Browser globals
    }
})( function(when){


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
                return when.all(self._recoverPromises)
            } else {
                return when.reject(reason)
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
        return when.all(this._promises).catch(recover(self, payload))
    };




    // helper : when an action is fired transform a callback in promise
    Dispatcher.prototype._addPromise = function(callback, payload) {
        var promise = callback(payload);
        this._promises.push(promise);
    };

    // helper : transform a callback in promise that will be use to recover after
    // failed process
    Dispatcher.prototype._addPromiseRecover = function(callback, payload) {
        var promise = when.promise(function(resolve, reject, notify) {
            if (callback(payload)) {
                resolve(payload);
            } else {
                reject(new Error('Dispatcher callback unsuccessful'));
            }
        });
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
    Dispatcher.prototype.waitFor = function(/*Array*/ promiseIndexes, /*function*/ callback) {
        var selectedPromises = [];
        var self = this
        promiseIndexes.forEach(function(index) {
            selectedPromises.push(self._promises[index]);
        });

        return when.all(selectedPromises).then(callback);
    };


    // Allow a store to do something after an error occured
    Dispatcher.prototype.waitForError = function( /*function*/ callback) {
        this._recovers.push(callback)
        return when.resolve();
    };

    // Allow a store to create a deferred process
    // callback must return true (for resolve) or false (to reject)
    Dispatcher.prototype.defer = function(/*function*/ callback) {
        return when.promise(function(resolve, reject, notify) {
            if (callback()) {
                resolve(true);
            } else {
                reject(new Error('Dispatcher callback unsuccessful'));
            }
        });
    };

    // Helper for creating a deferred that always resolve
    Dispatcher.prototype.noop = function(value) { return when.resolve(value) };
    // Helper for creating a deferred that always reject
    Dispatcher.prototype.fail = function(value) { return when.reject(value) };


    return Dispatcher

});
