define(['Constants'], function (constants) {

	function setState($scope, CalendarStore) {
        $scope.list = CalendarStore.getCalendarList();
        $scope.calendar = CalendarStore.getCalendar();
		$scope.classNeedCalendar = $scope.calendar  ? "calendar-not-need-select" : "calendar-need-select";
	}

    return function ($scope, CalendarStore, actions) {
			
        // Get the data
        setState($scope, CalendarStore)
        
        // update the data
        $scope.$on(CalendarStore.id, function() {
			setState($scope, CalendarStore)
        })	

		// Interaction handlers
		
		// select calendar
		$scope.choose = function(calendar) {
			//actions.setCalendar(calendar.id);
			$scope.$emit("dispatcher", constants.SET_CALENDAR, { calendar : calendar.id })
		}

    };
});