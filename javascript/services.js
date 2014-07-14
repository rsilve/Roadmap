define([
    'angular',
    'services/dispatcher',
    'services/ProjectStore'
], function (angular, dispatcher, ProjectStore) {

    /* services hub */
    return angular.module('Roadmap.services', [])
        .factory("dispatcher", dispatcher)
        .factory("ProjectStore", ['$rootScope', '$timeout', ProjectStore]);
});