/*
 * This module help for communication with google API
 */


(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["when", "rest", "actions/ProjectActions"],  factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var when = require("when");
        var rest = require("rest");
        var actions = require("actions/ProjectActions")

        module.exports = factory(when, rest, actions)
    } else {
        // Browser globals
    }
})(function(when, rest, actions) {


    // Rest client
    var client = rest;

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

    // helper to create ajax request
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
            return client(c)
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