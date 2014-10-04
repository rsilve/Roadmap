define([], function () {

    return function ($q, $http) {
		console.info("Loading Google Service")
        // constants for google api
        var clientId = '914287465512-b14fug3f6kgg1a1t1bm6srvq0d6q5l63.apps.googleusercontent.com';
        var apiKey = 'AIzaSyCNen5JjpKBaXRgg0oUeD1HpTnfORZY9pw';
        var scopes = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar";
        var google_api = "https://www.googleapis.com/calendar/v3";

        // auth object is deferred
        // use it before each request to be sure that
        // auth process is completed
		var auth = (function() {
			var deferred = $q.defer();
	        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, function (result) {
	            if (result && !result.error) {
	                deferred.resolve(gapi.auth.getToken());
	            } else {
	                //actions.authFailed();
	                deferred.reject("Google said : Not authorized")
	            }
	        });
	        return deferred.promise
		})()
		

        // helper to create  request
        function request(c) {
			console.debug("Send reqest " + c.path)
            c = c || {};
            c.method = c.method || "GET";
            c.url = google_api +  c.path;
            
			return auth.then(function (auth) {
				console.debug("Got Google auth "+auth.access_token)
                c.headers = {
                    // this header is required by google api
                    "Authorization": auth.token_type + " " + auth.access_token,
                    "Content-Type" :  "application/json"
                };
                return $http(c).then(function(r) {
					console.log(r)
                    return r.data
                })
            });
        }

        // request for getting events list
        var events = function(calendar) {
            return request({method: 'GET', path: "/calendars/"+calendar+"/events"});
        };

        // request for creating a new event
        // data is a JSON string
        var createEvent = function(calendar, data) {
            return request({
                method: 'POST',
                path: "/calendars/"+calendar+"/events",
                data : data
            });
        };

        // request for delete an event
        var deleteEvent = function(calendar, id) {
            return request({
                method: 'DELETE',
                path: "/calendars/"+calendar+"/events/"+id
            });
        };


        // request for update an event
        // data is a JSON string
        var updateEvent = function(calendar, id, data) {
            return request({
                method: 'PUT',
                path: "/calendars/"+calendar+"/events/"+id,
                data: data
            });
        };

        // request for getting calendarList
        var calendarList = function() {
            return request({
                method: 'GET',
                path: "/users/me/calendarList"
            });
        };


        // Expose API
        return function(calendar) {
            if (calendar)
                return {
                    events: function() { return events(calendar) },
                    createEvent: function(data) { return createEvent(calendar, data) },
                    deleteEvent: function(id) { return deleteEvent(calendar, id) },
                    updateEvent: function(id, data) { return updateEvent(calendar, id, data) }
                };
            else
                return {
                    events: function() { return when.reject("Calendar ID needed") },
                    createEvent:  function() { return when.reject("Calendar ID needed") },
                    deleteEvent:  function() { return when.reject("Calendar ID needed") },
                    updateEvent:  function() { return when.reject("Calendar ID needed") },
                    calendarList:  function() { return calendarList() }
                };
        };

    };
});