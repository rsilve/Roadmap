requirejs.config({
    paths: {
        "angular": 		'../bower_components/angular/angular',
        "pikaday": 		'../bower_components/pikaday/pikaday',
        "jquery": 		"../bower_components/jquery/dist/jquery",
        "moment": 		"../bower_components/momentjs/min/moment-with-locales.min",
        "toastr": 		"../bower_components/toastr/toastr",
    },
    
    shim: {
        'angular' : {'exports' : 'angular'}
    },
	config: {
	        moment: {
	            noGlobal: true
	        }
	    }
});

require( ['angular', 'app', 'moment'], function(angular, app, moment) {
	moment.locale('fr');
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['Roadmap']);
    });
});

