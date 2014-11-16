define(['stores/Store', 'services/Constants'], function (Store, constants) {

    return function (scope, dispatcher, auth) {

        var authBearer;

        /**
         * Contructor of the AuthenticationStore
         * This service manage the google authentication process
         * @constructor
         */
        function AuthenticationStore() {}
        AuthenticationStore.prototype = new Store(scope, dispatcher);

        /**
         * Get the auth bearer
         * @returns {*}
         */
        AuthenticationStore.prototype.getAuth = function() {return authBearer};

        /**
         * Helper for storing authentication token
         * @param auth
         */
        var setAuth = function (auth) {
            authBearer = auth.token_type + " " + auth.access_token;
            console.debug("Set auth token to "+authBearer)
        };

        var store = new AuthenticationStore();
        store.bind(constants.SESSION_LOADED, function(payload) {
            if (payload.session.auth && payload.session.auth !== null) {
                console.info("Load session auth info");
                authBearer = payload.session.auth;
            } else {
                console.info("Start authentication")
                return auth().then(setAuth);
            }
        }).bind(constants.LOGOUT, function(payload) {
            authBearer = undefined;
        });

        console.info("Loading AuthenticationStore Service " +store.id);
        return store;

    };
});