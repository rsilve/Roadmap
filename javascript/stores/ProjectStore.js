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
            console.debug("Save project " +  p.name)
			if (p.id) {
				// It's an update
	            return googleCalendar().updateEvent(p.id, projectHelper.serialize(p)).then(getProjects())				
			} else {
				return googleCalendar().createEvent(projectHelper.serialize(p)).then(getProjects())		
			}
        };
		
        
        // helper for delete a  project 
        var deleteProject = function(p) {
            console.debug("Delete project " +  p.name)
			return googleCalendar().deleteEvent(p.id).then(getProjects())				
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
		store.bind(constants.PROJECT_SAVE, function(payload) {
			return saveProject(action.project)
        }).bind(constants.PROJECT_DESTROY, function(payload) {
			return deleteProject(action.project)
        };)
		
        
		console.info("Loading ProjectStore Service " + store.id)
        return store;
    };
});