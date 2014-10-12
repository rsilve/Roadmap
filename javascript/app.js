define([
    'angular', 
	'directives/pikaday',
	'directives/timebar',
	'services/dispatcher',
	'services/Google',
	'stores/CalendarStore',
    'stores/ProjectStore', 
    'stores/TimeStore', 
    'stores/ProjectEditorStore', 
    'stores/HistoryStore', 
	'components/CalendarChooser',
	'components/ProjectToolbar',
	'components/Timebar',
    'components/ProjectList', 
    'components/ProjectEditor', 
    'components/HistoryList'
], function (angular, PikadayDirective, TimebarDirective,
	Dispatcher, Google,
	CalendarStore, ProjectStore , TimeStore, ProjectEditorStore, HistoryStore,
	CalendarChooser, ProjectToolbar, Timebar, ProjectList, ProjectEditor, HistoryList) {

    // Declare app level module which depends on filters, and services

	angular.module('Roadmap.services', [])
    .factory("google", ['$q', '$http', Google])
    .factory("dispatcher", ['$rootScope', '$q', Dispatcher])
    
	angular.module('Roadmap.stores', [])
	.factory("CalendarStore", ['$rootScope','dispatcher', 'google',  CalendarStore])
	.factory("ProjectStore", ['$rootScope','dispatcher', 'google', 'CalendarStore', ProjectStore])
	.factory("TimeStore", ['$rootScope','dispatcher', TimeStore])
	.factory("ProjectEditorStore", ['$rootScope','dispatcher', 'ProjectStore', ProjectEditorStore])
	.factory("HistoryStore", ['$rootScope','dispatcher', 'ProjectStore', '$interval', HistoryStore])
	
	angular.module('Roadmap.components', [])
    .controller('ProjectList', ['$scope',  'ProjectStore','CalendarStore', 'TimeStore', ProjectList])
    .controller('ProjectToolbar', ['$scope', 'CalendarStore', ProjectToolbar])
    .controller('CalendarChooser', ['$scope', 'CalendarStore', CalendarChooser])
    .controller('Timebar', ['$scope', 'TimeStore', Timebar])
    .controller('ProjectEditor', ['$scope', 'ProjectEditorStore', ProjectEditor])
    .controller('HistoryList', ['$scope', 'HistoryStore', HistoryList])
    
	angular.module('Roadmap.directives', [])
	.directive('pikaday', PikadayDirective)
	.directive('timebar', ['TimeStore', TimebarDirective])
	
    return angular.module('Roadmap', 
		['Roadmap.services', 'Roadmap.stores', "Roadmap.components", 'Roadmap.directives'])
    
	

});