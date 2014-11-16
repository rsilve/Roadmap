define([], function () {

    return function ($q) {
		console.info("Loading Google Auth Service")
        // constants for google api
        var clientId = '914287465512-b14fug3f6kgg1a1t1bm6srvq0d6q5l63.apps.googleusercontent.com';
        var scopes = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/plus.login";

        // auth object is deferred
        // use it before each request to be sure that
        // auth process is completed
		return  function() {
			var deferred = $q.defer();
			// User need to unblock authorization popup
			// for this method work
	        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, function (result) {
	            if (result && !result.error) {
					deferred.resolve(gapi.auth.getToken());
	            } else {
					console.warn(result);
	                deferred.reject("Google said : Not authorized")
	            }
	        });
	        return deferred.promise
		};

    };
});