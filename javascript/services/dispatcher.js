define([
    'app', "dispatcher/AppDispatcher"
], function (app, dispatcher) {

    app.factory('dispatcher', function () {
        return dispatcher
    });
});