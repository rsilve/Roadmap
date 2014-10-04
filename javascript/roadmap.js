requirejs.config({
    paths: {
        "angular": 		'../bower_components/angular/angular',
        "jquery": 		"../bower_components/jquery/dist/jquery",
        "momentjs": 	"../bower_components/momentjs/moment",
        "toastr": 		"../bower_components/toastr/toastr",
    },
    
    shim: {
        'angular' : {'exports' : 'angular'},
		'momentjs': {'exports' : 'moment'}
    }
});

require( ['angular', 'app'], function(angular, app) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['Roadmap']);
    });
});

