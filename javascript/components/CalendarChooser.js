define(['Constants'], 
function (constants) {

	return function($scope, CalendarStore) {
		
		var setState = function() {
	        $scope.list = CalendarStore.getCalendarList();
	        $scope.calendar = CalendarStore.getCalendar();
		}
		
		// Initial state
		setState();
		
		// Binding
		$scope.$on(CalendarStore.id, setState);
        
		// Interaction handlers
		// select calendar
		$scope.choose = function(calendar) {
			$scope.$emit("dispatcher", constants.SET_CALENDAR, { calendar : calendar.id })
		}
		
	}
	
});