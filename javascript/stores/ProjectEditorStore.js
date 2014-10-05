define([
    'stores/Store',
	'Constants',
	"moment"
], function (Store, constants, moment) {

	
    return function ($scope, dispatcher, ProjectStore) {
	
		var project = undefined;
			
		// Store Object 
        function ProjectEditorStore() {}
		// inherit from Store for events method
        ProjectEditorStore.prototype = new Store($scope)
		
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
			console.debug("Cancel project edit " +  project.name)
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
		var callbacks = {};
        callbacks[constants.PROJECT_EDIT] = function(action) {
            return dispatcher.defer(setProject(action.project)).then(store.emitChange())
        };
        callbacks[constants.PROJECT_EDIT_CANCEL] = function(action) {
            return dispatcher.defer(resetProject).then(store.emitChange())
        };
        callbacks[constants.PROJECT_SAVE] = function(action) {
			return dispatcher.waitFor([ProjectStore.dispatchIndex])
			.then(resetProject)
			.then(store.emitChange())
        };
        callbacks[constants.PROJECT_CREATE] = function(action) {
            return dispatcher.defer(createProject).then(store.emitChange())
        };
        
        // register the callbacks
        dispatcher.registerCallbacks(callbacks);
		
		console.info("Loading ProjectEditorStore Service " + store.id)
        return store;
    };
});