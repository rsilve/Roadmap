define([
    'angular',
    'services/dispatcher',
    'services/Google',
    'services/ProjectStore'
], function (angular, dispatcher, Google, ProjectStore) {

    /* services hub */
    return angular.module('Roadmap.services', [])
        .factory("dispatcher", dispatcher)
        .factory("google", Google)
        .factory("ProjectStore", ['$rootScope', '$timeout', ProjectStore]);
});