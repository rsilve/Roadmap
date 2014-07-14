var helper = require("../javascript/react/stores/ProjectHelper");
var moment = require("../bower_components/momentjs/moment");

exports.tests = {
    setUp: function (done) {
        done();
    },
    serialize : function(test) {
        test.expect(1);
        var project = {
            id: "bot1j45o45qp2hi9dk6ce1iqto",
            name: "Test de charge du nouveau moteur",
            start: moment("2014-06-15"),
            end: moment("2014-12-12"),
            sequence: 3,
            description: "sdfsdfsdfsdfsdfv",
            attendees: [
                {
                    "email": "rsdfsfd@s.fr",
                    "responseStatus": "needsAction"
                }
            ]
        };

        var expected = {
            "id": "bot1j45o45qp2hi9dk6ce1iqto",
            "summary": "Test de charge du nouveau moteur",
            "description": "sdfsdfsdfsdfsdfv",
            "start": {
                "date": "2014-06-15"
            },
            "end": {
                "date": "2014-12-12"
            },
            "sequence": 3,
            "attendees": [
                {
                    "email": "rsdfsfd@s.fr",
                    "responseStatus": "needsAction"
                }
            ],
            "reminders": {
                overrides: []
            }
        };

        var result = helper.serialize(project);
        test.deepEqual(result, expected);

        test.done()
    },
    deserialize : function(test) {
        test.expect(1);
        var project = {
            "kind": "calendar#event",
            "etag": "\"YXScLSGt5eQyeaGqs-mFGG1f00k/MjgwNjY5MzE1ODIxMjAwMA\"",
            "id": "bot1j45o45qp2hi9dk6ce1iqto",
            "status": "confirmed",
            "htmlLink": "https://www.google.com/calendar/event?eid=Ym90MWo0NW80NXFwMmhpOWRrNmNlMWlxdG8gbGtlaXUzbDdlc2pnODR1NDlwYjg3Z3A0YXNAZw",
            "created": "2014-06-12T19:45:10.000Z",
            "updated": "2014-06-21T15:05:16.210Z",
            "summary": "Test de charge du nouveau moteur",
            "description": "sdfsdfsdfsdfsdfv",
            "creator": {
                "email": "robert.silve@gmail.com",
                "displayName": "Robert Silve"
            },
            "organizer": {
                "email": "lkeiu3l7esjg84u49pb87gp4as@group.calendar.google.com",
                "displayName": "Roadmap",
                "self": true
            },
            "start": {
                "date": "2014-06-15"
            },
            "end": {
                "date": "2014-12-12"
            },
            "iCalUID": "bot1j45o45qp2hi9dk6ce1iqto@google.com",
            "sequence": 3,
            "attendees": [
                {
                    "email": "rsdfsfd@s.fr",
                    "responseStatus": "needsAction"
                }
            ],
            "reminders": {
                "useDefault": false
            }
        };
        var expected = {
            id: "bot1j45o45qp2hi9dk6ce1iqto",
            name: "Test de charge du nouveau moteur",
            start: moment("2014-06-15"),
            end: moment("2014-12-12"),
            sequence: 3,
            description: "sdfsdfsdfsdfsdfv",
            attendees: [
                {
                    "email": "rsdfsfd@s.fr",
                    "responseStatus": "needsAction"
                }
            ]
        };

        var result = helper.deserialize(project);
        test.deepEqual(result, expected);
        test.done()
    }


};