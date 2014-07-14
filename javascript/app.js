define([
    'angular', 'controllers', 'services'
], function (angular, controllers, services) {

    // Declare app level module which depends on filters, and services

    return angular.module('Roadmap', [
        'Roadmap.controllers', 'Roadmap.services'
    ]);
});