define([
    'stores/Store',
	'services/Constants',
	"moment"
], function (Store, constants, moment) {

	
    return function (scope, dispatcher, ProjectStore) {
	
		var project = undefined;
			
		// Store Object 
        function ProjectEditorStore() {}
		// inherit from Store for events method
        ProjectEditorStore.prototype = new Store(scope, dispatcher)
		
        // Simple accessor use by components for read the project
        ProjectEditorStore.prototype.getProject = function() {
            return project
        };
        // helper for setting project in dispatcher
        var setProject = function(p) {
			console.info("Edit project " +  p.name)
            project = p;
        };
		
        // helper for resetting project
        var resetProject = function() {
			console.info("Cancel project edit ", project)
			project = undefined;
        };

        // helper for create project
        var createProject = function() {
            console.info("Create new project")
            project = {
                start : moment(),
                end : moment().add(1, "month")
            };
        };

        // helper for add attendee on project
        var addAttendee = function(attendee) {
            console.info("Add attendee");
            project.attendees.push(attendee.trim());
        };

        // helper for remove attendee on project
        var removeAttendee = function(attendee) {
            console.info("Remove attendee "+attendee);
            var a = [];
            project.attendees.forEach(function(item) {
                if (item != attendee) {
                    a.push(item)
                }
            });
            project.attendees = a;
        };



        // Store instance
        var store = new ProjectEditorStore();
		store.bind(constants.PROJECT_EDIT, function(payload) {
			return setProject(payload.project)
        }).bind(constants.PROJECT_EDIT_CANCEL, function() {
			return resetProject()
        }).bind(constants.PROJECT_SAVE, function(payload, ec) {
			return ec.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_SAVE]])
			.then(resetProject)	
        }).bind(constants.PROJECT_INSERT, function(payload, ec) {
			return ec.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_INSERT]])
			.then(resetProject)	
        }).bind(constants.PROJECT_DESTROY, function(payload, ec) {
			return resetProject()
        }).bind(constants.PROJECT_CREATE, function() {
			return createProject()
        }).bind(constants.UNDO, function() {
            return resetProject()
        }).bind(constants.ADD_ATTENDEE, function(payload) {
            return addAttendee(payload.attendee)
        }).bind(constants.REMOVE_ATTENDEE, function(payload) {
            return removeAttendee(payload.attendee)
        });
        
		
		
		console.info("Loading ProjectEditorStore Service " + store.id);
        return store;
    };
});