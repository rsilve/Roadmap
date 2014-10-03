define([
    "dispatcher/Dispatcher"
], function (Dispatcher) {

    return function () {
        console.info("Loading Dispatcher Service")
        return new Dispatcher()
    };
});