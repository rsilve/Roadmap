/*
 * This module help for communication with google API
 */


define(["jquery",  "actions/ProjectActions" ], function($, actions) {

    // constants for google api
    var clientId = '914287465512-b14fug3f6kgg1a1t1bm6srvq0d6q5l63.apps.googleusercontent.com';
    var apiKey = 'AIzaSyCNen5JjpKBaXRgg0oUeD1HpTnfORZY9pw';
    var scopes = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar";
    var google_api = "https://www.googleapis.com/calendar/v3";

    // auth object is deferred
    // use it before each request to be sure that
    // auth process is completed
    var auth = $.Deferred();
    // start the authorization process
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, function(result) {
        if (result && !result.error) {
            auth.resolve(gapi.auth.getToken());
        } else {
           actions.authFailed();
           auth.reject("Not authorized")
        }
    });

    // helper to create ajax request
    function request(c) {
        c = c || {};
        c.type = c.method || "GET";
        c.url = google_api +  c.path;

        return auth.then(function (auth) {
            c.headers = {
                // this header is required by google api
                "Authorization": auth.token_type + " " + auth.access_token
            };
            c.contentType = "application/json";
            c.dataType = 'json';
            return $.ajax(c)
        });
    };

    // request for getting events list
    var events =  function() {
        return request({method: 'GET', path: "/calendars/lkeiu3l7esjg84u49pb87gp4as@group.calendar.google.com/events"});
    };

    // request for creating a new event
    // data is a JSON string
    var createEvent = function(data) {
        return request({
            method: 'POST',
            path: "/calendars/lkeiu3l7esjg84u49pb87gp4as@group.calendar.google.com/events",
            data : data
        });
    };

    // request for delete an event
    var deleteEvent = function(id) {
        return request({
            method: 'DELETE',
            path: "/calendars/lkeiu3l7esjg84u49pb87gp4as@group.calendar.google.com/events/"+id
        });
    };


    // request for update an event
    // data is a JSON string
    var updateEvent = function(id, data) {
        return request({
            method: 'PUT',
            path: "/calendars/lkeiu3l7esjg84u49pb87gp4as@group.calendar.google.com/events/"+id,
            data: data
        });
    };


    // Expose API
    return {
        events: events,
        createEvent : createEvent,
        deleteEvent : deleteEvent,
        updateEvent : updateEvent
    };

});