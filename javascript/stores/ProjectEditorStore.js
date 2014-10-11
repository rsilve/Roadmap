define([
    'stores/Store',
	'Constants',
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
            return function() {
				console.debug("Edit project " +  p.name)
                project = p;
                return true; // needed fo dispatcher
            }
        };
		
        // helper for resetting project
        var resetProject = function() {
			console.debug("Cancel project edit ", project)
			project = undefined;
            return true; // needed fo dispatcher
        };

        // helper for create project
        var createProject = function() {
			console.debug("Create new project")
			project = {
				start : moment(),
				end : moment().add(1, "month")
			};
            return true; // needed fo dispatcher
        };
		
		
		
		// Store instance
        var store = new ProjectEditorStore();
		store.bind(constants.PROJECT_EDIT, function(payload) {
			return dispatcher.defer(setProject(payload.project))
        }).bind(constants.PROJECT_EDIT_CANCEL, function() {
			return dispatcher.defer(resetProject)
        }).bind(constants.PROJECT_SAVE, function() {
			return dispatcher
			.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_SAVE]])
			.then(resetProject)	
        }).bind(constants.PROJECT_INSERT, function() {
			return dispatcher
			.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_INSERT]])
			.then(resetProject)	
        }).bind(constants.PROJECT_DESTROY, function() {
			return dispatcher
			.waitFor([ProjectStore.dispatchIndex[constants.PROJECT_DESTROY]])
			.then(resetProject)
        }).bind(constants.PROJECT_CREATE, function() {
			return dispatcher.defer(createProject)
        }).bind(constants.UNDO, function() {
			return dispatcher.defer(resetProject)
		})
        
		
		
		console.info("Loading ProjectEditorStore Service " + store.id)
        return store;
    };
});