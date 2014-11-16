define(['angular', 'services/Constants', 'stores/Store'], function (angular, constants, Store) {

    /**
     * Mock provider for projectStore
     *
     * @param scope
     * @param dispatcher
     * @returns {*}
     * @constructor
     */

    function AuthenticationStoreProvider (scope, dispatcher) {
        console.info("Loading AuthenticationStore mock");

        function AuthenticationStore() {}
        // inherit from Store for events method
        AuthenticationStore.prototype = new Store(scope, dispatcher);

        var store = new AuthenticationStore();

        store.bind(constants.SESSION_LOADED, function(payload, ec) {
            return 1; // do nothing
        }).bind(constants.LOGOUT, function(payload, ec) {
            return 1; // do nothing
        });

        // spy return function !! don't forget to call to return final mock store
       return jasmine.createSpy("AuthenticationStore").andReturn(store)();
    }

    /**
     * Load the mocks as providers
     */
    angular.module('AuthenticationStore.mock', [])
        .provider('AuthenticationStore', function() { this.$get = ["$rootScope", "dispatcher", AuthenticationStoreProvider] });



});