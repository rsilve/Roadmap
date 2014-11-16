define(['angular', 'services/Constants', 'stores/Store'], function (angular, constants, Store) {

    /**
     * Mock provider for projectStore
     *
     * @param scope
     * @param dispatcher
     * @returns {*}
     * @constructor
     */

    function AuthenticationStoreProvider (scope, $q, dispatcher) {
        console.info("Loading AuthenticationStore mock");

        var bearer = $q.defer();

        function AuthenticationStore() {}
        AuthenticationStore.prototype = new Store(scope, dispatcher);
        AuthenticationStore.prototype.getAuth = function() {return bearer.promise};
        AuthenticationStore.prototype.resolve = function() {bearer.resolve()};
        AuthenticationStore.prototype.reject = function() {bearer.reject()};

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
        .provider('AuthenticationStore', function() { this.$get = ["$rootScope", "$q", "dispatcher", AuthenticationStoreProvider] });



});