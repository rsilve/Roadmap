requirejs.config({
    paths: {
        "angular": '../bower_components/angular/angular',
        "EventEmitter": "../bower_components/eventEmitter/EventEmitter",
        "jquery": "../bower_components/jquery/dist/jquery",
        "momentjs": "../bower_components/momentjs/moment",
        "toastr": "../bower_components/toastr/toastr",
        "when": "../bower_components/when",
        "rest": "../bower_components/rest",
        "mime": "../bower_components/rest/interceptor"
    },
    "packages": [
        {
            name : "when",
            main: "when"
        },
        {
            name : "rest",
            main: "rest"
        }
    ],
    shim: {
        'angular' : {'exports' : 'angular'}
    }
});

require( ['angular', 'app'], function(angular, app) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['Roadmap']);
    });
});

