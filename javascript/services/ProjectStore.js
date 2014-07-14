define([
    'store/Store'
], function (Store) {

    return function ($scope, $timeout) {
        console.log("ProjectStore Init")

        var hello = "hello robert";


        function ProjectStore() {}
        ProjectStore.prototype = new Store($scope)
        ProjectStore.prototype.hello = function() { return hello};

        var store = new ProjectStore();
        $timeout(function() {
            hello = "bye";
            store.emitChange();
        }, 2000);


        return store;
    };
});