define([
    'angular',
    'services/dispatcher'
], function (angular, dispatcher ) {

    /* services hub */
    return angular.module('Roadmap.services', [])
        .factory("dispatcher", dispatcher);
});