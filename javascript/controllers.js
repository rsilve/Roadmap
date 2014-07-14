define([
    'angular',
    'controllers/ProjectList'
], function (angular, ProjectList) {

    /* controllers hub */
    return angular.module('Roadmap.controllers', [])
        .controller('ProjectList', ['$scope', 'ProjectStore', ProjectList]);
});