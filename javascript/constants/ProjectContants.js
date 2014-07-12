/*
 * This module list some constants
 * These constants are used to identify actions
 */

(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        module.exports = factory()
    } else {
        // Browser globals
    }
})(function() {

    return {
        PROJECT_CREATE: "PROJECT_CREATE",
        PROJECT_DESTROY: "PROJECT_DESTROY",
        PROJECT_UPDATE_NAME: "PROJECT_UPDATE_NAME",
        PROJECT_UPDATE_START: "PROJECT_UPDATE_START",
        PROJECT_UPDATE_END: "PROJECT_UPDATE_END",
        PROJECT_UPDATE_DESCRIPTION: "PROJECT_UPDATE_DESCRIPTION",
        PROJECT_FILTER: "PROJECT_FILTER",
        PROJECT_REMOVE_ATTENDEE: "PROJECT_REMOVE_ATTENDEE",
        PROJECT_ADD_ATTENDEE: "PROJECT_ADD_ATTENDEE",
        PROJECT_UPDATE_ATTENDEE: "PROJECT_UPDATE_ATTENDEE",
        TIME_NEXT_PERIOD: "TIME_NEXT_PERIOD",
        TIME_PREV_PERIOD: "TIME_PREV_PERIOD",

        AUTH_FAILED: "AUTH_FAILED",

        SET_CALENDAR: "SET_CALENDAR"
    }

});