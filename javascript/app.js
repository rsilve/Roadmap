define([
    'angular', 
	'directives/pikaday',
	'services/dispatcher',
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
	Dispatcher, Google,
	CalendarStore, ProjectStore , TimeStore, ProjectEditorStore,
	CalendarChooser, ProjectToolbar, Timebar, ProjectList, ProjectEditor) {

    // Declare app level module which depends on filters, and services

	angular.module('Roadmap.services', [])
    .factory("google", ['$q', '$http', Google])
    .factory("dispatcher", ['$rootScope', '$q', Dispatcher])
    
	angular.module('Roadmap.stores', [])
	.factory("CalendarStore", ['dispatcher', 'google',  CalendarStore])
	.factory("ProjectStore", ['dispatcher', 'google', 'CalendarStore', ProjectStore])
	.factory("TimeStore", ['dispatcher', TimeStore])
	.factory("ProjectEditorStore", ['dispatcher', 'ProjectStore', ProjectEditorStore])
	

	angular.module('Roadmap.components', [])
    .controller('ProjectList', ['$scope',  'ProjectStore','CalendarStore', 'TimeStore', ProjectList])
    .controller('ProjectToolbar', ['$scope',  ProjectToolbar])
    .controller('CalendarChooser', ['$scope', 'CalendarStore', CalendarChooser])
    .controller('Timebar', ['$scope', 'TimeStore', Timebar])
    .controller('ProjectEditor', ['$scope', 'ProjectEditorStore', ProjectEditor])
    
	angular.module('Roadmap.directives', [])
	.directive('pikaday', PikadayDirective)
	
	
	
    return angular.module('Roadmap', ['Roadmap.services', 'Roadmap.stores', "Roadmap.components", 'Roadmap.directives'])
    
	

});