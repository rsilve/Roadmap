define(['stores/Store', 'services/Constants'], function (Store, constants) {

    return function (scope, dispatcher, TimeStore, auth) {

        var session = sessionStorage;

        /**
         * Contructor of the calendarStore
         * This service manage the working calendar across application
         * @constructor
         */
        function SessionStore() {}
        SessionStore.prototype = new Store(scope, dispatcher);


        /**
         * Create an instance and bind it on some events
         * @type {SessionStore}
         */
        var store = new SessionStore();
        store.bind(constants.SET_CALENDAR, function(payload) {
            console.info("Store calendar in session");
            session.calendar = payload.calendar;
        }).bind(constants.RESET_CALENDAR, function(payload) {
            console.info("Reset session on calendar change");
            delete session.calendar;
        }).bind(constants.TIME_NEXT_PERIOD, function() {
            console.info("Store time scale in session");
            session.timeStart = TimeStore.getStart().unix();
        }).bind(constants.TIME_PREV_PERIOD, function() {
            console.info("Store time scale in session");
            session.timeStart = TimeStore.getStart().unix();
        }).bind(constants.TIME_DAYS, function() {
            console.info("Store time scale in session");
            session.timeScale = TimeStore.ZOOM_DAYS;
        }).bind(constants.TIME_WEEKS, function() {
            console.info("Store time scale in session");
            session.timeScale = TimeStore.ZOOM_WEEKS;
        }).bind(constants.TIME_MONTHS, function() {
            console.info("Store time scale in session");
            session.timeScale = TimeStore.ZOOM_MONTHS;
        });

        /**
         * Store the auth token to be reused
         */
        if (! session.auth) {
            auth().then(function (auth) {
                console.info("Store auth token in session");
                session.auth = auth.token_type + " " + auth.access_token;
            });
        }

        console.info("Loading Session Service");
        return session;

    };
});