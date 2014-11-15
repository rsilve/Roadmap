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

        google().me().then(setProfile).then(store.emitChange());


        console.info("Loading ProfileStore Service");
        return store;

    };
});