/*
 * This module help for communication with google API
 */


(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["when", "rest", "rest/interceptor/mime", "actions/ProjectActions"],  factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var when = require("when");
        var rest = require("rest");
        var mime = require("rest/interceptor/mime");
        var actions = require("actions/ProjectActions")

        module.exports = factory(when, rest, mime, actions)
    } else {
        // Browser globals
    }
})(function(when, rest, mime, actions) {


    // constants for google api
    var clientId = '914287465512-b14fug3f6kgg1a1t1bm6srvq0d6q5l63.apps.googleusercontent.com';
    var apiKey = 'AIzaSyCNen5JjpKBaXRgg0oUeD1HpTnfORZY9pw';
    var scopes = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar";
    var google_api = "https://www.googleapis.com/calendar/v3";

    // auth object is deferred
    // use it before each request to be sure that
    // auth process is completed
    var auth = when.promise(function(resolve, reject, notify) {
        // start the authorization process
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, function (result) {
            if (result && !result.error) {
                resolve(gapi.auth.getToken());
            } else {
                actions.authFailed();
                reject("Not authorized")
            }
        });
    });

    // helper to create  request
    function request(c) {
        c = c || {};
        c.method = c.method || "GET";
        c.path = google_api +  c.path;
        c.entity = c.data;

        return auth.then(function (auth) {
            c.headers = {
                // this header is required by google api
                "Authorization": auth.token_type + " " + auth.access_token,
                "Content-Type" :  "application/json"
            };
            return rest.wrap(mime)(c).then(function(r) {
                return r.entity
            })
        });
    }

    // request for getting events list
    var events = function(calendar) { //lkeiu3l7esjg84u49pb87gp4as@group.calendar.google.com
        return request({method: 'GET', path: "/calendars/"+calendar+"/events"});
    };

    // request for creating a new event
    // data is a JSON string
    var createEvent = function(calendar, data) {
        return request({
            method: 'POST',
            path: "/calendars/"+calendar+"/events",
            data : data
        });
    };

    // request for delete an event
    var deleteEvent = function(calendar, id) {
        return request({
            method: 'DELETE',
            path: "/calendars/"+calendar+"/events/"+id
        });
    };


    // request for update an event
    // data is a JSON string
    var updateEvent = function(calendar, id, data) {
        return request({
            method: 'PUT',
            path: "/calendars/"+calendar+"/events/"+id,
            data: data
        });
    };


    // Expose API
    return function(calendar) {
        if (calendar)
            return {
                events: function() { return events(calendar) },
                createEvent: function(data) { return createEvent(calendar, data) },
                deleteEvent: function(id) { return deleteEvent(calendar, id) },
                updateEvent: function(id, data) { return updateEvent(calendar, id, data) }
            };
        else
            return {
                events: function() { return when.reject("Calendar ID needed") },
                createEvent:  function() { return when.reject("Calendar ID needed") },
                deleteEvent:  function() { return when.reject("Calendar ID needed") },
                updateEvent:  function() { return when.reject("Calendar ID needed") }
            };
    };

});