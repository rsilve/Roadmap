requirejs.config({
	paths: {
        "EventEmitter": "../bower_components/eventEmitter/EventEmitter",
        "jquery": "../bower_components/jquery/dist/jquery",
        "momentjs": "../bower_components/momentjs/moment",
        "react": "../bower_components/react/react",
        "react-with-addons": "../bower_components/react/react-with-addons",
        "toastr": "../bower_components/toastr/toastr",
        "jasmine" : "../bower_components/jasmine/lib/jasmine-core/jasmine",
        "jasmine-html" : "../bower_components/jasmine/lib/jasmine-core/jasmine-html",
        "boot" : "../bower_components/jasmine/lib/jasmine-core/boot"
	},
	
    shim: {
        'momentjs': {exports : 'moment'},
        'jasmine' : {exports : 'jasmineRequire'},
        'jasmine-html' : { deps: ['jasmine'] },
        'boot' : { deps: ['jasmine', 'jasmine-html'], exports : 'jasmine'}
    }
});

require.config({
    noGlobal: true
});

require(['spec/index', 'boot'], function(index, boot) {

    // Jasmine boot is not completely adapted to use
    // with requirejs, so it is needed to redo some init
    var jasmineEnv = boot.getEnv();
    var queryString = new jasmine.QueryString({
        getWindowLocation: function() { return window.location; }
    });

    var htmlReporter = new boot.HtmlReporter({
        env: jasmineEnv,
        onRaiseExceptionsClick: function() { queryString.setParam("catch", !jasmineEnv.catchingExceptions()); },
        getContainer: function() { return document.body; },
        createElement: function() { return document.createElement.apply(document, arguments); },
        createTextNode: function() { return document.createTextNode.apply(document, arguments); },
        timer: new boot.Timer()
    });
    jasmineEnv.addReporter(htmlReporter);

    // Now we can load specs and execute
    require(index.specs, function() {
        htmlReporter.initialize();
        jasmineEnv.execute();
    });

});

