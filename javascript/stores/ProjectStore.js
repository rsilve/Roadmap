define([
    'stores/Store',
	'stores/ProjectHelper',
	'Constants'
], function (Store,  projectHelper, constants) {

	
    return function ($scope, dispatcher, google, CalendarStore) {
		
		// store projects here
		var _projects = {};
        

		// factory for google client
		function googleCalendar() {
            var c = CalendarStore.getCalendar();
            if (c)
                return google(c);
            else
                return google(undefined)
        }
			
		// return a promise of projects List
        function getProjects() {
            var initProjects = function(data) {
                _projects = {};
                if (data.items !== undefined)
                    data.items.forEach(function(item) {
                        _projects[item.id] = projectHelper.deserialize(item)
                    });
                return _projects
            };
            var errorHandler = function(err) {
                _projects = {};
                console.warn(err);
            };
            return googleCalendar().events().then(initProjects).catch(errorHandler)

        }
		
		
		
        // helper for saving a  project in dispatcher
        var saveProject = function(p) {
            return function() {
				console.debug("Save project " +  p.name)
                return googleCalendar().updateEvent(p.id, projectHelper.serialize(p)).then(function() {
                	return getProjects();
            	}); 
            }
        };
		

			
		// Store Object 
        function ProjectStore() {}
		// inherit from Store for events method
        ProjectStore.prototype = new Store($scope)
		
		// get the projects list
        ProjectStore.prototype.getProjects = function() {
        	return getProjects();
        }
		
		// Store instance
        var store = new ProjectStore();
        var callbacks = {};
        callbacks[constants.PROJECT_SAVE] = function(action) {
			return dispatcher.defer(saveProject(action.project)).then(store.emitChange())
        };
      
        // register the callbacks
        store.dispatchIndex = dispatcher.registerCallbacks(callbacks);
		
		console.info("Loading ProjectStore Service " + store.id)
        return store;
    };
});