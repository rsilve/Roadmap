define([
    'angular', 
	'services/dispatcher',
    'services/Google',
	'services/CalendarStore',
    'services/ProjectStore', 
	'controllers/CalendarChooser',
    'controllers/ProjectList' 
], function (angular, 
	Dispatcher, Google,
	CalendarStore, ProjectStore , 
	CalendarChooser, ProjectList) {

    // Declare app level module which depends on filters, and services

    return angular.module('Roadmap', [])
    .factory("dispatcher",  Dispatcher)
    .factory("google", Google)
	.factory("ProjectStore", ['$rootScope', '$timeout', ProjectStore])
	.factory("CalendarStore", ['$rootScope', 'dispatcher', 'google',  CalendarStore])
    .controller('ProjectList', ['$scope', 'ProjectStore', ProjectList])
    .controller('CalendarChooser', ['$scope', 'CalendarStore',  CalendarChooser])

});