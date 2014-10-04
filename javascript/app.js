define([
    'angular', 
	'services/dispatcher',
	'services/Actions',
    'services/Google',
	'store/CalendarStore',
    'store/ProjectStore', 
	'components/CalendarChooser',
	'components/ProjectToolbar',
    'components/ProjectList' 
], function (angular, 
	Dispatcher, Actions, Google,
	CalendarStore, ProjectStore , 
	CalendarChooser, ProjectToolbar, ProjectList) {

    // Declare app level module which depends on filters, and services

	angular.module('Roadmap.services', [])
    .factory("google", Google)
    .factory("dispatcher",  Dispatcher)
    .factory("actions", ['dispatcher', Actions])

	angular.module('Roadmap.stores', [])
	.factory("ProjectStore", ['$rootScope', '$timeout', ProjectStore])
	.factory("CalendarStore", ['$rootScope', 'dispatcher', 'google',  CalendarStore])
    

	angular.module('Roadmap.components', [])
    .controller('ProjectList', ['$scope', 'ProjectStore', ProjectList])
    .controller('ProjectToolbar', ['$scope', 'actions', ProjectToolbar])
    .controller('CalendarChooser', ['$scope', 'CalendarStore', 'actions', CalendarChooser])

    return angular.module('Roadmap', ['Roadmap.services', 'Roadmap.stores', "Roadmap.components"])
    
	

});