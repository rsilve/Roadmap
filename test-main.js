var allTestFiles = [];
var TEST_REGEXP = /_test\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\/javascript\//, '').replace(/\.js$/, '');
};


Object.keys(window.__karma__.files).forEach(function(file) {
  //console.log(file)	
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

//console.log(allTestFiles)

require.config({
  // Karma serves files under /base/javascript, which is the basePath from your config file
  baseUrl: '/base/javascript/',
  paths: {
	  "angular": 		'../bower_components/angular/angular',
      "angular-mocks":  '../bower_components/angular-mocks/angular-mocks',
      "pikaday": 		'../bower_components/pikaday/pikaday',
      "jquery": 		"../bower_components/jquery/dist/jquery",
      "moment": 		"../bower_components/momentjs/min/moment-with-locales.min",
      "toastr": 		"../bower_components/toastr/toastr"
    },
    shim: {
        'angular' : {'exports' : 'angular'},
        "angular-mocks" : {"deps" : ["angular"]},
        // by default we load angular mock before app
        // so we can use it in all tests
        "app" : {"deps" : ["angular-mocks"]}
    },
	config: {
	        moment: {
	            noGlobal: true
	        }
	    },
	
  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});

