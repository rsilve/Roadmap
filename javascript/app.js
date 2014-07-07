requirejs.config({
	paths: {
        "EventEmitter": "../bower_components/eventEmitter/EventEmitter",
        "jquery": "../bower_components/jquery/dist/jquery",
        "momentjs": "../bower_components/momentjs/moment",
        "react": "../bower_components/react/react",
        "react-with-addons": "../bower_components/react/react-with-addons",
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
        },
        {
            name : "mime",
            main: "mime"
        }
    ],
	
    shim: {
        'momentjs': {exports : 'moment'}
    }
});

require.config({
    noGlobal: true
});

require(["react-with-addons", "momentjs", "components/ProjectList", "components/ProjectToolbar", "components/Timebar", "google", "stores/MessageStore"],
    function(React, moment, ProjectList, ProjectToolbar, TimeBar, google) {

        React.renderComponent(
            ProjectList({}),
            document.getElementById('project-list')
        );

        React.renderComponent(
            ProjectToolbar({}),
            document.getElementById('project-toolbar')
        );

        React.renderComponent(
            TimeBar({date: moment()}),
            document.getElementById('time-bar')
        );

    });

