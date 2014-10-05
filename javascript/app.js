define([
    'angular', 
	'directives/pikaday',
	'services/dispatcher',
	'services/Actions',
    'services/Google',
	'stores/CalendarStore',
    'stores/ProjectStore', 
    'stores/TimeStore', 
    'stores/ProjectEditorStore', 
	'components/CalendarChooser',
	'components/ProjectToolbar',
	'components/Timebar',
    'components/ProjectList', 
    'components/ProjectEditor' 
], function (angular, PikadayDirective,
	Dispatcher, Actions, Google,
	CalendarStore, ProjectStore , TimeStore, ProjectEditorStore,
	CalendarChooser, ProjectToolbar, Timebar, ProjectList, ProjectEditor) {

    // Declare app level module which depends on filters, and services

	angular.module('Roadmap.services', [])
    .factory("google", ['$q', '$http', Google])
    .factory("dispatcher", ['$q', Dispatcher])
    .factory("actions", ['dispatcher', Actions])

	angular.module('Roadmap.stores', [])
	.factory("CalendarStore", ['$rootScope', 'dispatcher', 'google',  CalendarStore])
	.factory("ProjectStore", ['$rootScope', 'dispatcher', 'google', 'CalendarStore', ProjectStore])
	.factory("TimeStore", ['$rootScope', 'dispatcher', TimeStore])
	.factory("ProjectEditorStore", ['$rootScope', 'dispatcher', 'ProjectStore', ProjectEditorStore])
	

	angular.module('Roadmap.components', [])
    .controller('ProjectList', ['$scope', 'actions', 'ProjectStore','CalendarStore', 'TimeStore', ProjectList])
    .controller('ProjectToolbar', ['$scope', 'actions', ProjectToolbar])
    .controller('CalendarChooser', ['$scope', 'CalendarStore', 'actions', CalendarChooser])
    .controller('Timebar', ['$scope', 'actions', 'TimeStore', Timebar])
    .controller('ProjectEditor', ['$scope', 'actions', 'ProjectEditorStore', ProjectEditor])
    
	angular.module('Roadmap.directives', [])
	.directive('pikaday', PikadayDirective)
	
	
	
    return angular.module('Roadmap', ['Roadmap.services', 'Roadmap.stores', "Roadmap.components", 'Roadmap.directives'])
    
	

});