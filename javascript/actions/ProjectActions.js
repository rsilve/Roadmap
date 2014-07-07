/*
 * This module list all possible actions in the app
 */


(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["dispatcher/AppDispatcher", "constants/ProjectContants"], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var dispatcher = require("../dispatcher/AppDispatcher");
        var constants = require("../constants/ProjectContants");
        module.exports = factory(dispatcher, constants)
    } else {
        // Browser globals
    }
})(function(dispatcher, constants) {

    return  {
        // create a project given is name
        create: function (name) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_CREATE,
                name: name
            });
        },
        // Update project name
        updateName: function (id, name) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_UPDATE_NAME,
                id: id,
                name: name
            });
        },
        // update start date project
        updateStart: function (id, start) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_UPDATE_START,
                id: id,
                start: start
            });
        },
        // update end date project
        updateEnd: function (id, end) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_UPDATE_END,
                id: id,
                end: end
            });
        },
        // update project description
        updateDescription: function (id, desc) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_UPDATE_DESCRIPTION,
                id: id,
                description: desc
            });
        },
        // remove project attendee
        removeAttendee: function (id, email) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_REMOVE_ATTENDEE,
                id: id,
                email: email
            });
        },
        // add project attendee
        addAttendee: function (id, email) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_ADD_ATTENDEE,
                id: id,
                email: email
            });
        },
        // update attendee email
        updateAttendee: function (id, oldEmail, email) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_UPDATE_ATTENDEE,
                id: id,
                oldEmail: oldEmail,
                email: email
            });
        },
        // delete a project
        destroy: function (id, name) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_DESTROY,
                id: id,
                name : name
            });
        },
        // filtering the project list
        filter: function (filter) {
            dispatcher.handleViewAction({
                actionType: constants.PROJECT_FILTER,
                filter : filter
            });
        },
        // display  the next quarter
        nextPeriod : function() {
            dispatcher.handleViewAction({
                actionType: constants.TIME_NEXT_PERIOD
            });
        },
        // display the previous quarter
        previousPeriod : function() {
            dispatcher.handleViewAction({
                actionType: constants.TIME_PREV_PERIOD
            });
        },
        // auth failed ....
        authFailed : function() {
            console.log("auth failed")
            dispatcher.handleViewAction({
                actionType: constants.AUTH_FAILED
            });
        }
    }

});
