/*
 * This module list all possible actions in the app
 */

define([
    'Constants'
],function (constants) {
    
	
	
	return function (dispatcher) { 
		var dispatchMap = {
	        // edit a project 
	        editProject: function (project) {
	            dispatcher.handleViewAction({
	                actionType: constants.PROJECT_EDIT,
	                project: project
	            });
	        },
	        // cancel project edit 
	        cancelEditProject: function () {
	            dispatcher.handleViewAction({
	                actionType: constants.PROJECT_EDIT_CANCEL
	            });
	        },
	        // create a project given is name
	        create: function (name) {
	            dispatcher.handleViewAction({
	                actionType: constants.PROJECT_CREATE,
	                name: name
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
	        },
	        // Set Calendar
	        setCalendar : function(id) {
	            dispatcher.handleViewAction({
	                actionType: constants.SET_CALENDAR,
	                id : id
	            });
	        },
	        // Reset Calendar
	        resetCalendar : function() {
	            dispatcher.handleViewAction({
	                actionType: constants.RESET_CALENDAR
	            });
	        }
		};		
		
		return  dispatchMap 
	}
	
});

