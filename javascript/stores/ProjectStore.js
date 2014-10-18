define([
    'stores/Store',
	'stores/ProjectHelper',
	'services/Constants'
], function (Store,  projectHelper, constants) {

	
    return function (scope, dispatcher, google, CalendarStore) {
		
		// store projects here
		var _projects = {};
		var loading = false
        
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
            console.info("Get project list")
            return googleCalendar().events().then(initProjects).catch(errorHandler)

        }
		
		
		
        // helper for saving a  project in dispatcher
        var saveProject = function(p) {
            console.info("Save project " +  p.name)
			return googleCalendar()
				.updateEvent(p.id, projectHelper.serialize(p))
				.then(function() { return getProjects() })
        };
        // helper for saving a  project in dispatcher
        var insertProject = function(p) {
            console.info("insert project " +  p.name)
			return googleCalendar()
				.createEvent(projectHelper.serialize(p))
				.then(function() { return getProjects() })
        };
		
        
        // helper for delete a  project 
        var deleteProject = function(p) {
            console.info("Delete project ", p)
			return googleCalendar()
			.deleteEvent(p.id)
			.then(function() { return getProjects() })				
        };
		
		var undoHandler = {}
		undoHandler[constants.PROJECT_SAVE] = function(payload, ec) {
			var p = payload.from
			if (p.id) {
				p.sequence ++;
				return saveProject(p)
			} else {
				return ec.noop() // deleteProject(payload.project)
			}			
		};
		undoHandler[constants.PROJECT_DESTROY] = function(payload, ec) {
			var p = payload.project;
			if (p.id) {
				delete p.id;
				return insertProject(p)
			} else {
				return ec.when()
			}
			
		};
		var undo = function(payload, ec) {
			console.debug("Undo", payload.data.payload)
			if (undoHandler[payload.data.payload.actionType])
			  return undoHandler[payload.data.payload.actionType](payload.data.payload)
			else 
			  return ec.noop()
		};
		
			
		// Store Object 
        function ProjectStore() {}
		// inherit from Store for events method
        ProjectStore.prototype = new Store(scope, dispatcher)
		
		// get the projects list
        ProjectStore.prototype.getProjects = function() {
        	return _projects;
        };
		
		// get loading status
        ProjectStore.prototype.isLoading = function() {
        	return loading;
        };
		// get loading status
        ProjectStore.prototype.loadingEvent = function() {
        	return this.id+"-loading";
        };
		
		ProjectStore.prototype.emitLoading = function() {
			loading = true;
			console.debug("Emit ", this.loadingEvent())
			this.$scope.$broadcast(this.loadingEvent());
		};
		
		// override emit change for emitting loadingEvent AND changEvent
	    ProjectStore.prototype.emitChange = function() {
			var self = this;
			return function() {
				loading = false;
		        self.$scope.$broadcast(self.id)
				self.$scope.$broadcast(self.loadingEvent())
			}
		
	    };
		
		ProjectStore.prototype.bind = function(/* string */ event, /* function */ callback, /* boolean */ emitDisabled) {
			var self = this;
			var f = function(payload, ec) {
				return ec.when(self.emitLoading())
				.then(function() { return callback(payload, ec) })
			};
			
			return Store.prototype.bind.call(this, event, f, emitDisabled)
		};
		
		// Store instance
        var store = new ProjectStore();
		store.bind(constants.PROJECT_SAVE, function(payload) {
			return saveProject(payload.project)
        }).bind(constants.PROJECT_INSERT, function(payload) {
			return insertProject(payload.project)
        }).bind(constants.PROJECT_DESTROY, function(payload) {
			return deleteProject(payload.project)
        }).bind(constants.SET_CALENDAR, function(payload) {
			return getProjects()
        }).bind(constants.UNDO, function(payload) {
			return undo(payload)
        }).bind(constants.PROJECT_REFRESH_LIST, function(payload) {
			return getProjects()
        });
		
        
		console.info("Loading ProjectStore Service " + store.id)
        return store;
    };
});