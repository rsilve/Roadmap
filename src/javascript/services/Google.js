define([], function () {

    return function ($q, auth, $http) {
		console.info("Loading Google Service");

        var session = sessionStorage;

        /**
         * Constant used to construct all google api request
         * @type {string}
         */
        var google_api = "https://www.googleapis.com/calendar/v3";


        /**
         * Helper method use to create a google api request.
         * It wrap the call of authentication check, the creation
         * of the authenticated header, the generation of the url based on a common prefix
         * {@see google_api}.
         *
         * @param c
         * @returns {promise}
         */
        function request(c) {
			c = c || {};
            c.method = c.method || "GET";
            if (!c.url) {
                c.url = google_api + c.path;
            }
            console.debug("Send request " + c.url);
            return authOrSession(c).then(function(r) {
				console.debug("request result", r);
				return r.data 
			}).catch(function(err) {
				console.warn("Google", err);
                return $q.reject(err)
			});
        }

        function authOrSession(c) {
            if (session.auth) {
                c.headers = {
                    // this header is required by google api
                    "Authorization": session.auth,
                    "Content-Type" : "application/json"
                };
                return $http(c)
            } else {
                return auth().then(function (auth) {
                    console.debug("Got Google auth "+auth.access_token);
                    c.headers = {
                        // this header is required by google api
                        "Authorization": auth.token_type + " " + auth.access_token,
                        "Content-Type" :  "application/json"
                    };
                    return $http(c)
                })
            }
        }

        /**
         * Method that return the events from a calendar
         * @param calendar
         * @returns {promise}
         */
        var events = function(calendar) {
            return request({method: 'GET', path: "/calendars/"+calendar+"/events"});
        };

        /**
         * Method that create a new event in a calendar.
         * data must be valid ({@see ProjectHelper} for helping data serialization)
         *
         * @param calendar
         * @param data
         * @returns {promise}
         */
        var createEvent = function(calendar, data) {
            return request({
                method: 'POST',
                path: "/calendars/"+calendar+"/events",
                data : data
            });
        };

        /**
         * Method for delete an event of a calendar
         *
         * @param calendar
         * @param id
         * @returns {promise}
         */
        var deleteEvent = function(calendar, id) {
            return request({
                method: 'DELETE',
                path: "/calendars/"+calendar+"/events/"+id
            });
        };


        /**
         * Method for update an event in a calendar
         * data must be valid ({@see ProjectHelper} for helping data serialization)
         *
         * @param calendar
         * @param id
         * @param data
         * @returns {promise}
         */
        var updateEvent = function(calendar, id, data) {
            return request({
                method: 'PUT',
                path: "/calendars/"+calendar+"/events/"+id,
                data: data
            });
        };

        /**
         * Method for get the calendar list
         *
         * @returns {promise}
         */
        var calendarList = function() {
            return request({
                method: 'GET',
                path: "/users/me/calendarList"
            });
        };

        var me = function() {
            return request({
                method : 'GET',
                url : "https://www.googleapis.com/plus/v1/people/me"
            })
        };

        /**
         * Expose the API
         */
        return function(calendar) {
            if (calendar)
                return {
                    events: function() { return events(calendar) },
                    createEvent: function(data) { return createEvent(calendar, data) },
                    deleteEvent: function(id) { return deleteEvent(calendar, id) },
                    updateEvent: function(id, data) { return updateEvent(calendar, id, data) },
                    me: function() { return me() }
                };
            else
                return {
                    events: function() { return $q.reject("Calendar ID needed") },
                    createEvent:  function() { return $q.reject("Calendar ID needed") },
                    deleteEvent:  function() { return $q.reject("Calendar ID needed") },
                    updateEvent:  function() { return $q.reject("Calendar ID needed") },
                    calendarList:  function() { return calendarList() },
                    me: function() { return me() }
                };
        };

    };
});