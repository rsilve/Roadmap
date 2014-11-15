define(['angular', 'services/Constants', 'stores/Store'], function (angular, constants, Store) {

    /**
     * Mock provider for projectStore
     *
     * @param scope
     * @param dispatcher
     * @returns {*}
     * @constructor
     */

    function ProjectStoreProvider (scope, dispatcher) {
        console.info("Loading ProjectStore mock");

        function ProjectStore() {}
        // inherit from Store for events method
        ProjectStore.prototype = new Store(scope, dispatcher);

        var store = new ProjectStore();

        store.bind(constants.PROJECT_SAVE, function(payload, ec) {
            return 1; // do nothing
        }).bind(constants.UNDO, function(payload, ec) {
            return 1; // do nothing
        });

        // spy return function !! don't forget to call to return final mock store
       return jasmine.createSpy("ProjectStore").andReturn(store)();
    }

    /**
     * Load the mocks as providers
     */
    angular.module('ProjectStore.mock', [])
        .provider('ProjectStore', function() { this.$get = ["$rootScope", "dispatcher", ProjectStoreProvider] });



});