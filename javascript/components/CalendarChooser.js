define(['Constants'], function (constants) {

	function setState($scope, CalendarStore) {
        $scope.list = CalendarStore.getCalendarList;
        $scope.calendar = CalendarStore.getCalendar;
	}

    return function ($scope, CalendarStore) {
			
        // Initial state
        setState($scope, CalendarStore)
        
		// Interaction handlers
		// select calendar
		$scope.choose = function(calendar) {
			$scope.$emit("dispatcher", constants.SET_CALENDAR, { calendar : calendar.id })
		}

    };
});