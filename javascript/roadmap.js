requirejs.config({
    paths: {
        "angular": 		'../bower_components/angular/angular',
        "pikaday": 		'../bower_components/pikaday/pikaday',
        "jquery": 		"../bower_components/jquery/dist/jquery",
        "moment": 		"../bower_components/momentjs/moment",
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

require( ['angular', 'app'], function(angular, app) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['Roadmap']);
    });
});

