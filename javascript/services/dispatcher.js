define([
    "dispatcher/AppDispatcher"
], function (dispatcher) {

    return function () {
        console.info("Loading Dispatcher Service")
        return dispatcher
    };
});