(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["momentjs"], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var moment = require("../../bower_components/momentjs/moment")
        module.exports = factory(moment)
    } else {
        // Browser globals
    }
})(function(moment){

    return {
        // local json to Google json
        serialize: function (item) {
            return {
                id: item.id,
                summary: item.name,
                start: { date: item.start.format("YYYY-MM-DD") },
                end: { date: item.end.format("YYYY-MM-DD") },
                attendees: item.attendees || [],
                reminders: { overrides: [] },
                sequence: item.sequence,
                description: item.description
            };
        },

        // google json to local json
        deserialize: function deserialize(item) {
            return {
                id: item.id,
                name: item.summary,
                start: moment(item.start.date),
                end: moment(item.end.date),
                sequence: item.sequence,
                description: item.description,
                attendees: item.attendees || []
            };
        }
    }



});