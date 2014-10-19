define(['angular'], function (angular) {


    angular.module('Roadmap.mocks', [])
    .provider('GoogleAuth', function() {

        this.$get = ['$q', function($q) {

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

        }];
    });

});