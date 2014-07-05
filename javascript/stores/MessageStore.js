/*
 * This store intend to manage notification message.
 * It act after other stores or on error recovery
 * It does not send change event on component
 */

define(["toastr", "dispatcher/AppDispatcher", "constants/ProjectContants", "stores/ProjectStore"],
    function(toastr, dispatcher, constants, ProjectStore) {



        var notifyCreate = function(action) {
            return function() { toastr.info("Project "+ action.name +" created") }
        };
        var notifyDelete = function(action) {
            return function() { toastr.info("Project "+ action.name +" removed") }
        };
        var notifyUpdateStarError = function(action) {
            return function() { toastr.warning("Incorrect date " + action.start.format("DD/MM/YYYY")) }
        };
        var notifyUpdateEndError = function(action) {
            return function() { toastr.warning("Incorrect date " + action.end.format("DD/MM/YYYY")) }
        };
        var notifyAddAttendeeError = function() {
            toastr.warning("Problem when adding email")
        };
        var notifyAuthFailed = function() {
            toastr.warning("Authorization failed")
        };


        var callbacks = {};
        callbacks[constants.PROJECT_CREATE] = function(action) {
            return dispatcher.waitFor([ProjectStore.dispatchIndex], notifyCreate(action))
        };
        callbacks[constants.PROJECT_DESTROY] = function(action) {
            return dispatcher.waitFor([ProjectStore.dispatchIndex], notifyDelete(action))
        };
        callbacks[constants.PROJECT_UPDATE_START] = function(action) {
            return dispatcher.waitForError(notifyUpdateStarError(action))
        };
        callbacks[constants.PROJECT_UPDATE_END] = function(action) {
            return dispatcher.waitForError(notifyUpdateEndError(action))
        };
        callbacks[constants.PROJECT_ADD_ATTENDEE] = function() {
            return dispatcher.waitForError(notifyAddAttendeeError)
        };
        callbacks[constants.AUTH_FAILED] = function() {
            return dispatcher.defer(notifyAuthFailed)
        };

        // register the callbacks
        dispatcher.registerCallbacks(callbacks);

});