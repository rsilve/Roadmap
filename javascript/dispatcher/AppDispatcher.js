/*
 * This module implement a dispatcher
 */

define(["dispatcher/Dispatcher"], function(Dispatcher){

    function AppDispatcher() {}


    AppDispatcher.prototype = new Dispatcher();

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.  Another variant here could be handleServerAction.
     * @param  {object} action The data coming from the view.
     */
    AppDispatcher.prototype.handleViewAction = function(action) {
       this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        }).fail(function(reason) {
           console.log(reason)
       })
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
            var action = payload.action;
            if (callbacks[action.actionType])
              return callbacks[action.actionType](action);
            else
              return self.noop();
        })
    };


    return new AppDispatcher();

})