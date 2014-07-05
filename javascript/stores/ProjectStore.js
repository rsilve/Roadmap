/*
 * This store intend to manage projects list.
 *
 */


define(["jquery", "momentjs", "toastr", "dispatcher/AppDispatcher", "stores/Store", "constants/ProjectContants", "google"],
    function($, moment, toastr, dispatcher, Store, constants, google) {

        /*
         * Here we define the Project class
         */

        var _projects = {};
        var _filter = null;

        function ProjectStore() {
            var self = this
            getProjects().then(function() {self.emitChange()})
        }

        ProjectStore.prototype = new Store()

        // return the promise of a filtered project list
        ProjectStore.prototype.getFiltered = function(){
            return getProjects().then(function(projects) {
                var filtered = [];
                for (var key in projects) {
                    var m = projects[key]
                    if (filter(m, _filter))
                        filtered.push(m)
                }
                return filtered
            })
        };


        ProjectStore.prototype.getAll = function(){
            return _projects
        };
        ProjectStore.prototype.size = function(){
            var size = 0;
            for (var p in _projects)
                size ++
            return size
        };

        ProjectStore.prototype.getFilter = function(){
            return _filter
        };


        /*
         * Here we define some internal helper for the dispatching
         */

        // return a promise of projects List
        function getProjects() {
            var initProjects = function(data) {
                _projects = {};
                if (data.items !== undefined)
                    data.items.forEach(function(item) {
                        _projects[item.id] = deserialize(item)
                    });
                return _projects
            };
            var errorHandler = function(err) {
                _projects = {};
                console.log(err);
            };
            return google.events().then(initProjects, errorHandler)

        }

        // local json to Google json
        function serialize(item) {
            return {
                id : item.id,
                summary : item.name,
                start : { date : item.start.format("YYYY-MM-DD") },
                end : { date : item.end.format("YYYY-MM-DD") },
                attendees : item.attendees || [],
                reminders : { overrides : [] },
                sequence: item.sequence,
                description: item.description
            };
        }

        // google json to local json
        function deserialize(item) {
            return {
                id : item.id,
                name : item.summary,
                start : moment(item.start.date),
                end : moment(item.end.date),
                sequence: item.sequence,
                description: item.description,
                attendees : item.attendees || []
            };
        }

        // return wether or not a project match the given filter
        function filter(project, filter) {
            if (filter && filter.trim() !== "") {
                return (project.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) //||
                //(project.start.format("LL").toLowerCase().indexOf(filter.toLowerCase()) >= 0) ||
                //(project.end.format("LL").toLowerCase().indexOf(filter.toLowerCase()) >= 0)
            }
            return true
        }

        // create a new empty project
        // return a promise of project list
        function create(text) {
            var item =  {
                name: text,
                start: moment(),
                end: moment().add("month", 1)
            };
            return google.createEvent(JSON.stringify(serialize(item))) // JSON.stringify(serialize(item)),
                 .then(function() {
                return getProjects();
            });
        }


        // delete a project
        // return a promise of project list
        function destroy(id) {
            return google.deleteEvent(id).then(function() {
                return getProjects();
            });
            //delete _projects[id];
        }

        // delete an attendee of the project
        // return a promise of project list
        function removeAttendee(id, email) {
            var attendees = _projects[id].attendees;
            var attendeeToDelete = undefined;
            attendees.forEach(function(attendee, index) {
                if (attendee.email.toLocaleUpperCase() === email.toLocaleUpperCase()) {
                    attendeeToDelete = index;
                }
            })
            delete attendees[attendeeToDelete];
            _projects[id].attendees = attendees;
            return updateProject(_projects[id])
        }

        // modify an attendee of the project
        // return a promise of project list
        function updateAttendee(id, oldEmail, email) {
            var attendees = _projects[id].attendees;
            var attendeeToUpdate = undefined;
            attendees.forEach(function(attendee, index) {
                if (attendee.email.toLocaleUpperCase() === oldEmail.toLocaleUpperCase()) {
                    attendeeToUpdate = index;
                }
            });
            attendees[attendeeToUpdate].email = email;
            _projects[id].attendees = attendees;
            return updateProject(_projects[id])
        }

        // add an attendee to the project
        // return a promise of project list
        function addAttendee(id, email) {
            var attendees = _projects[id].attendees;
            var attendeeExists = undefined;
            attendees.forEach(function(attendee) {
                if (attendee.email.toLocaleUpperCase() === email.toLocaleUpperCase()) {
                    attendeeExists = true;
                }
            });
            if (attendeeExists) {
                $.Deferred().reject("email already link to this project");
            } else {
                _projects[id].attendees.push({email: email});
                return updateProject(_projects[id])
            }
        }

        // send a project to google for update
        // return a promise of project list
        function updateProject(project) {
            return google.updateEvent(project.id, JSON.stringify(serialize(project))) //JSON.stringify(serialize(project))
            .then(function() {
                return getProjects();
            });
        }

        // update the project name
        // return a promise of project list
        function updateName(id, name) {
            _projects[id].name = name;
            return updateProject(_projects[id])
        }

        // update the project description
        // return a promise of project list
        function updateDescription(id, description) {
            _projects[id].description = description;
            return updateProject(_projects[id])
        }

        // update the project date start
        // return a promise of project list
        function updateStart(id, start) {
            if (start.isBefore( _projects[id].end)) {
                _projects[id].start = start.clone();
                return updateProject(_projects[id])
            }
            return $.Deferred().reject("Invalid date");

        }

        // update the project date end
        // return a promise of project list
        function updateEnd(id, end) {
            if (end.isAfter( _projects[id].start)) {
                _projects[id].end = end.clone();
                return updateProject(_projects[id])
            }
            return $.Deferred().reject("Invalid date");
        }

        // set a filter that will be applied ti project list
        function setFilter(action) {
            return function() {
                _filter = action.filter.trim();
                return true;
            };
        }


        /*
         * here whe create an instance of the store
         * and we register some actions in the dispatcher
         */

        var store = new ProjectStore()

        var callbacks = {}
        callbacks[constants.PROJECT_CREATE] = function(action) {
            var text = action.name.trim();
            if (text !== '') {
                return create(text).then(store.emitChange());
            }
        };
        callbacks[constants.PROJECT_DESTROY] = function(action) {
            if (action.id && action.id !== '')
                return destroy(action.id).then(store.emitChange());
        };
        callbacks[constants.PROJECT_UPDATE_NAME] = function(action) {
            var name = action.name.trim();
            if (name !== '')
                return updateName(action.id, name).always(store.emitChange());
        };
        callbacks[constants.PROJECT_UPDATE_DESCRIPTION] = function(action) {
            var desc = action.description.trim();
            if (desc !== '')
                return updateDescription(action.id, desc).always(store.emitChange());
        };
        callbacks[constants.PROJECT_UPDATE_START] = function(action) {
            var start = action.start;
            if (start)
                return updateStart(action.id, start).always(store.emitChange())
        };
        callbacks[constants.PROJECT_UPDATE_END] = function(action) {
            var end = action.end;
            if (end) {
                return updateEnd(action.id, end).always(store.emitChange())
            }
        };
        callbacks[constants.PROJECT_REMOVE_ATTENDEE] = function(action) {
            if (action.id && action.email) {
                return removeAttendee(action.id, action.email).always(store.emitChange())
            }
        };
        callbacks[constants.PROJECT_ADD_ATTENDEE] = function(action) {
            if (action.id && action.email) {
                return addAttendee(action.id, action.email).always(store.emitChange())
            }
        };
        callbacks[constants.PROJECT_UPDATE_ATTENDEE] = function(action) {
            if (action.id && action.oldEmail && action.email) {
                return updateAttendee(action.id, action.oldEmail , action.email).always(store.emitChange())
            }
        };
        callbacks[constants.PROJECT_FILTER] = function(action) {
            return dispatcher.defer(setFilter(action)).then(store.emitChange());
        };

        // register and store the reference of this register
        // useful to use the wait feature of the dispatcher
        store.dispatchIndex = dispatcher.registerCallbacks(callbacks)

        return store

});