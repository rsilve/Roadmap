/*
 * Base module for store
 *
 * A store is an event emitter. Component will register events for react
 * when store is changing.
 *
 */

define(["EventEmitter"], function(emitter) {

    // Event Constant name
    var CHANGE_EVENT = 'change';

    // Constructor herit from emitter module
    function Store() {}
    Store.prototype = new emitter()

    // helper for emit change event
    // this is design to be used in promise context
    // example
    /*
     *  dispatcher.defer( ... do something ... ).then(store.emitChange());
     *
     *  $.ajax(...).then(store.emitChange());
     */
    Store.prototype.emitChange = function () {
        var self = this;
        return function() {
            self.emit(CHANGE_EVENT);
        }
    };

    // helper for register event listener
    Store.prototype.addChangeListener = function (callback) {
        this.on(CHANGE_EVENT, callback);
    };

    // helper for unregister event listenr
    Store.prototype.removeChangeListener = function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    };

    return Store
});