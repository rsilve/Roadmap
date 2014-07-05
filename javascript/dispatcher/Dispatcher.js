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


define(["jquery"], function($){

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

    // method for dispatch an action to the stores
    Dispatcher.prototype.dispatch = function(payload) {
        this._clearPromises();
        var self = this;
        this._callbacks.forEach(function(callback) {
            self._addPromise(callback, payload);
        });
        return $.when.apply(null, this._promises).then(null, function(reason) {
            self._recovers.forEach(function (callback) {
                self._addPromiseRecover(callback, reason);
            });
            return $.when.apply(null, self._recoverPromises)
        })
    };

    // helper : when an action is fired transform a callback in promise
    Dispatcher.prototype._addPromise = function(callback, payload) {
        var deferred = callback(payload)
        this._promises.push(deferred);
    };

    // helper : transform a callback in promise that will be use to recover after
    // failed process
    Dispatcher.prototype._addPromiseRecover = function(callback, payload) {

        var deferred = new $.Deferred()
        if (callback(payload)) {
            deferred.resolve(payload);
        } else {
            deferred.reject(new Error('Dispatcher callback unsuccessful'));
        }
        this._recoverPromises.push(deferred);
    };

    // helper : before dispatch an action clear all promises
    Dispatcher.prototype._clearPromises = function() {
        this._promises = [];
        this._recovers = [];
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
        return $.when.apply(null, selectedPromises).then(callback);
    };


    // Allow a store to do something after an error occured
    Dispatcher.prototype.waitForError = function( /*function*/ callback) {
        this._recovers.push(callback)
        return $.Deferred().resolve()
    };

    // Allow a store to create a deferred process
    Dispatcher.prototype.defer = function(callback) {
        var deferred = new $.Deferred()
        if (callback()) {
            deferred.resolve();
        } else {
            deferred.reject(new Error('Dispatcher callback unsuccessful'));
        }
        return deferred;
    };

    // Helper for creating a deferred that don nothing and alwyas resolve
    Dispatcher.prototype.noop = function() { return new $.Deferred().resolve() }

    return Dispatcher

});

