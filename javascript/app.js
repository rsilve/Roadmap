define([
    'angular', 
	'services/dispatcher',
	'services/Actions',
    'services/Google',
	'stores/CalendarStore',
    'stores/ProjectStore', 
	'components/CalendarChooser',
	'components/ProjectToolbar',
    'components/ProjectList' 
], function (angular, 
	Dispatcher, Actions, Google,
	CalendarStore, ProjectStore , 
	CalendarChooser, ProjectToolbar, ProjectList) {

    // Declare app level module which depends on filters, and services

	angular.module('Roadmap.services', [])
    .factory("google", ['$q', '$http', Google])
    .factory("dispatcher", ['$q', Dispatcher])
    .factory("actions", ['dispatcher', Actions])

	angular.module('Roadmap.stores', [])
	.factory("CalendarStore", ['$rootScope', 'dispatcher', 'google',  CalendarStore])
	.factory("ProjectStore", ['$rootScope', 'dispatcher', 'google', 'CalendarStore', ProjectStore])
	

	angular.module('Roadmap.components', [])
    .controller('ProjectList', ['$scope', 'ProjectStore', ProjectList])
    .controller('ProjectToolbar', ['$scope', 'actions', ProjectToolbar])
    .controller('CalendarChooser', ['$scope', 'CalendarStore', 'actions', CalendarChooser])

    return angular.module('Roadmap', ['Roadmap.services', 'Roadmap.stores', "Roadmap.components"])
    
	

});