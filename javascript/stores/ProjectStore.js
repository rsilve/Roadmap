define([
    'stores/Store',
	'stores/ProjectHelper',
	'Constants'
], function (Store,  projectHelper, constants) {

	
    return function (scope, dispatcher, google, CalendarStore) {
		
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
	            return googleCalendar()
				.updateEvent(p.id, projectHelper.serialize(p))
				.then(function() { return getProjects() })				
			} else {
				return googleCalendar()
				.createEvent(projectHelper.serialize(p))
				.then(function() { return getProjects() })		
			}
        };
		
        
        // helper for delete a  project 
        var deleteProject = function(p) {
            console.debug("Delete project " +  p.name)
			return googleCalendar()
			.deleteEvent(p.id)
			.then(function() { return getProjects() })				
        };
		
		var undoHandler = {}
		undoHandler[constants.PROJECT_SAVE] = function(payload) {
			return saveProject(payload.from)
		}
		undoHandler[constants.PROJECT_DESTROY] = function(payload) {
			var p = payload.from
			delete p.id;
			return saveProject(payload.from)
		}
		var undo = function(payload) {
			console.log("Undo", payload.data.actionType)
			if (undoHandler[payload.data.actionType])
			  return undoHandler[payload.data.actionType](payload.data)
			else 
			  return dispatcher.noop()
		}
		
			
		// Store Object 
        function ProjectStore() {}
		// inherit from Store for events method
        ProjectStore.prototype = new Store(scope, dispatcher)
		
		// get the projects list
        ProjectStore.prototype.getProjects = function() {
        	return _projects;
        }
		
		// Store instance
        var store = new ProjectStore();
		store.bind(constants.PROJECT_SAVE, function(payload) {
			return saveProject(payload.project)
        }).bind(constants.PROJECT_DESTROY, function(payload) {
			return deleteProject(payload.project)
        }).bind(constants.SET_CALENDAR, function(payload) {
			return getProjects()
        }).bind(constants.UNDO, function(payload) {
			return undo(payload)
        })
		
        
		console.info("Loading ProjectStore Service " + store.id)
        return store;
    };
});