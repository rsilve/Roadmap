define([
    'angular', 
	'directives/pikaday',
	'directives/timebar',
    'directives/sessionAware',
    'services/ExecutionContext',
    'services/dispatcher',
    'services/GoogleAuth',
    'services/Google',
    'stores/SessionStore',
    'stores/CalendarStore',
    'stores/ProjectStore', 
    'stores/TimeStore', 
    'stores/ProjectEditorStore',
    'stores/HistoryStore',
    'stores/ConfirmStore',
    'components/CalendarChooser',
	'components/ProjectToolbar',
	'components/Timebar',
    'components/ProjectList', 
    'components/ProjectEditor', 
    'components/HistoryList',
    'components/Confirm'
], function (angular, PikadayDirective, TimebarDirective, SessionAwareDirective,
             ExecutionContext, Dispatcher, GoogleAuth, Google, SessionStore,
	CalendarStore, ProjectStore , TimeStore, ProjectEditorStore, HistoryStore, ConfirmStore,
	CalendarChooser, ProjectToolbar, Timebar, ProjectList, ProjectEditor, HistoryList, Confirm) {

    // Declare app level module which depends on filters, and services

	angular.module('Roadmap.services', [])
    .factory("GoogleAuth", ['$q',  GoogleAuth])
    .factory("Google", ['$q', "GoogleAuth", '$http', Google])
    .factory("ExecutionContext", ['$q', ExecutionContext])
    .factory("dispatcher", ['$rootScope', '$q', "ExecutionContext",  Dispatcher]);

    angular.module('Roadmap.stores', [])
    .factory("ConfirmStore", ['$rootScope','dispatcher', ConfirmStore])
    .factory("CalendarStore", ['$rootScope','dispatcher', 'Google',  CalendarStore])
    .factory("ProjectEditorStore", ['$rootScope','dispatcher', 'ProjectStore', ProjectEditorStore])
    .factory("ProjectStore", ['$rootScope','dispatcher', 'Google', 'CalendarStore', 'ConfirmStore', ProjectStore])
	.factory("TimeStore", ['$rootScope','dispatcher', TimeStore])
	.factory("HistoryStore", ['$rootScope','dispatcher', 'ProjectStore', '$interval', HistoryStore])
    .factory("SessionStore",['$rootScope','dispatcher', 'TimeStore', SessionStore]);

    angular.module('Roadmap.components', ['Roadmap.stores'])
    .controller('ProjectEditor', ['$scope', 'ProjectEditorStore',  ProjectEditor])
    .controller('ProjectList', ['$scope',  'ProjectStore','CalendarStore', 'ConfirmStore', ProjectList])
    .controller('ProjectToolbar', ['$scope', 'CalendarStore', 'ProjectStore', 'TimeStore', ProjectToolbar])
    .controller('CalendarChooser', ['$scope', 'CalendarStore', CalendarChooser])
    .controller('Timebar', ['$scope', 'TimeStore', Timebar])
    .controller('HistoryList', ['$scope', 'HistoryStore', HistoryList])
    .controller('Confirm', ['$scope', 'ConfirmStore', '$interval', Confirm]);

    angular.module('Roadmap.directives', [])
	.directive('pikaday', PikadayDirective)
    .directive('timebar', ['TimeStore', TimebarDirective])
    .directive('sessionAware', ['SessionStore', SessionAwareDirective]);

    return angular.module('Roadmap', 
		['Roadmap.services', 'Roadmap.stores', "Roadmap.components", 'Roadmap.directives'])

    
	

});