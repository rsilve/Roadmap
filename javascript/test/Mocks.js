define(['angular'], function (angular) {

    /**
     * In this file we define all specific mock that we need to carry
     * across tests
     */

    /**
     * GoogleAuth mock
     * The google auth module return a promise that contain
     * the authentication token when resolve.
     * The mock is a simple promise not resolved but augmented
     * with 2 method
     * One for resolve with default value emualting access token
     * One for reject.
     *
     * In tests you just need to resolve (or reject) explicitly
     * to ended the google service request
     *
     * google("calendarId").events().then(handlerThen).catch(handlerCatch);
     * auth.resolve();
     *
     * @param $q
     * @returns {promise}
     * @constructor
     */
    function GoogleAuthProvider ($q) {

        var d = $q.defer();
        var auth = d.promise;
        auth.resolve = function(value) {
            value = value || {access_token : "access_token", token_type : "bearer"}
            d.resolve(value);
        };

        auth.reject = function(value) {
            d.reject(value);
        };

        return auth

    }

    /**
     * Load the mocks as providers
     */
    angular.module('Roadmap.mocks', [])
    .provider('GoogleAuth', function() { this.$get = ['$q', GoogleAuthProvider] });

});