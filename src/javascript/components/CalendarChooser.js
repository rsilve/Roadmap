define(['services/Constants'], 
function (constants) {

    /**
     * Factory method for the CalendarChooser component
     */
	return function($scope, CalendarStore) {

        /**
         * Helper to set component state on each Stores notification
         */
		var setState = function() {
	        $scope.list = CalendarStore.getCalendarList();
	        $scope.calendar = CalendarStore.getCalendar();
		};

        // Init the component
        setState();


        // Bind the component to the stores
        $scope.$on(CalendarStore.id, setState);

        /**
         * scope handler to notify app that a calendar has been selected
          */
        $scope.choose = function(calendar) {
			$scope.$emit("dispatcher", constants.SET_CALENDAR, { calendar : calendar.id })
		};


	}
	
});