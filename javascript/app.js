define([
    'angular', 
	'directives/pikaday',
	'directives/timebar',
    'services/ExecutionContext',
    'services/dispatcher',
    'services/GoogleAuth',
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
             ExecutionContext, Dispatcher, GoogleAuth, Google,
	CalendarStore, ProjectStore , TimeStore, ProjectEditorStore, HistoryStore,
	CalendarChooser, ProjectToolbar, Timebar, ProjectList, ProjectEditor, HistoryList) {

    // Declare app level module which depends on filters, and services

	angular.module('Roadmap.services', [])
    .factory("GoogleAuth", ['$q',  GoogleAuth])
    .factory("google", ['$q', "GoogleAuth", '$http', Google])
    .factory("ExecutionContext", ['$q', ExecutionContext])
    .factory("dispatcher", ['$rootScope', '$q', "ExecutionContext",  Dispatcher]);

    angular.module('Roadmap.stores', [])
	.factory("CalendarStore", ['$rootScope','dispatcher', 'google',  CalendarStore])
	.factory("ProjectStore", ['$rootScope','dispatcher', 'google', 'CalendarStore', ProjectStore])
	.factory("TimeStore", ['$rootScope','dispatcher', TimeStore])
	.factory("ProjectEditorStore", ['$rootScope','dispatcher', 'ProjectStore', ProjectEditorStore])
	.factory("HistoryStore", ['$rootScope','dispatcher', 'ProjectStore', '$interval', HistoryStore]);
	
	angular.module('Roadmap.components', [])
    .controller('ProjectList', ['$scope',  'ProjectStore','CalendarStore', ProjectList])
    .controller('ProjectToolbar', ['$scope', 'CalendarStore', 'ProjectStore', ProjectToolbar])
    .controller('CalendarChooser', ['$scope', 'CalendarStore', CalendarChooser])
    .controller('Timebar', ['$scope', 'TimeStore', Timebar])
    .controller('ProjectEditor', ['$scope', 'ProjectEditorStore', ProjectEditor])
    .controller('HistoryList', ['$scope', 'HistoryStore', HistoryList])
    
	angular.module('Roadmap.directives', [])
	.directive('pikaday', PikadayDirective)
	.directive('timebar', ['TimeStore', TimebarDirective]);
	
    return angular.module('Roadmap', 
		['Roadmap.services', 'Roadmap.stores', "Roadmap.components", 'Roadmap.directives'])
    
	

});