define([
    'angular', 
	'controllers/CalendarChooser',
    'controllers/ProjectList', 
	'services/CalendarStore',
    'services/ProjectStore', 
	'dispatcher/AppDispatcher',
    'services/Google'
], function (angular, CalendarChooser, ProjectList, CalendarStore, ProjectStore , AppDispatcher, Google) {

    // Declare app level module which depends on filters, and services

    return angular.module('Roadmap', [])
    .controller('ProjectList', ['$scope', 'ProjectStore', ProjectList])
    .controller('CalendarChooser', ['$scope',  CalendarChooser])
    .factory("dispatcher",  AppDispatcher)
    .factory("google", Google)
	.factory("ProjectStore", ['$rootScope', '$timeout', ProjectStore])
	.factory("CalendarStore", ['$rootScope', 'dispatcher',  CalendarStore]);
;
});