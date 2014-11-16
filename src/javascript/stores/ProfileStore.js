define(['stores/Store', 'services/Constants'], function (Store, constants) {

    return function (scope, dispatcher, google) {

        var profile;

        /**
         * Contructor of the calendarStore
         * This service manage the working calendar across application
         * @constructor
         */
        function ProfileStore() {}
        ProfileStore.prototype = new Store(scope, dispatcher);

        /**
         * Get the profile
         * @returns {object}
         */
        ProfileStore.prototype.getProfile = function() {
            return profile;
        };

        /**
         * Helper for store profile info
         * @param data
         */
        var setProfile = function(data) {
            profile = data;
        };


        var store = new ProfileStore();
        store.bind(constants.AUTHENTICATION_COMPLETED, function() {
            return  google().me().then(setProfile)
        });


        console.info("Loading ProfileStore Service");
        return store;

    };
});