define(['stores/Store', 'services/Constants'], function (Store, constants) {

    return function (scope, $q, dispatcher, auth) {

        var authBearer = $q.defer();

        /**
         * Contructor of the AuthenticationStore
         * This service manage the google authentication process
         * @constructor
         */
        function AuthenticationStore() {}
        AuthenticationStore.prototype = new Store(scope, dispatcher);

        /**
         * Get the auth bearer as a promise
         * @returns {jQuery.promise|promise.promise|promise|d.promise|.ready.promise|jQuery.ready.promise|*}
         */
        AuthenticationStore.prototype.getAuth = function() {return authBearer.promise};

        /**
         * Helper for storing authentication token
         * @param auth
         */
        var setAuth = function (auth) {
            authBearer.resolve(auth);
            console.debug("Set auth token to "+auth)
        };

        /**
         * Helper for rejecting authentication
         */
        var rejectAuth = function() {
            authBearer.reject("Google said : Not authorized");
            console.debug("Reject authentication ")
        };

        var store = new AuthenticationStore();
        store.bind(constants.SESSION_LOADED, function(payload) {
            if (payload.session.auth && payload.session.auth !== null) {
                console.info("Load session auth info");
                setAuth(payload.session.auth)
            } else {
                console.info("Start authentication");
                return auth().then(function(a){ return a.token_type + " " + a.access_token}).then(setAuth).catch(rejectAuth);
            }
        }).bind(constants.LOGOUT, function(payload) {
            authBearer =  $q.defer();
            rejectAuth()
        });

        console.info("Loading AuthenticationStore Service " +store.id);
        return store;

    };
});