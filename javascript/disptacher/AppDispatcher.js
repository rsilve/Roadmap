/*
 * This module implement a dispatcher
 */

(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["dispatcher/Dispatcher"], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var Dispatcher = require("../dispatcher/Dispatcher")
        module.exports = factory(Dispatcher)
    } else {
        // Browser globals
    }
})(function(Dispatcher){

    function AppDispatcher() {}


    AppDispatcher.prototype = new Dispatcher();

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.  Another variant here could be handleServerAction.
     * @param  {object} action The data coming from the view.
     */
    AppDispatcher.prototype.handleViewAction = function(/* object */ action) {
        return this.dispatch(action).catch(function(err) { console.log(err) })
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
    AppDispatcher.prototype.registerCallbacks = function(callbacks) {
        var self = this;
        return this.register(function(payload) {
            if (callbacks[payload.actionType]) {
                return callbacks[payload.actionType](payload)
            } else
                return self.noop();
        })
    };


    return new AppDispatcher();

});