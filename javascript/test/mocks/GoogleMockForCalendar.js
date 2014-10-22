define(['angular'], function (angular) {

    function GoogleProvider ($q) {
        console.info("Loading Google mock");
        var obj = {
            calendarList : function() { return $q.when({items : ["A", "B"]}) }
        };
        return jasmine.createSpy("google").andReturn(obj);
    }

    /**
     * Load the mocks as providers
     */
    angular.module('Google.mocks', [])
        .provider('Google', function() { this.$get = ['$q', GoogleProvider] });



});