define(['Constants'], function (constants) {


    return function ($scope, CalendarStore) {
		var setState = function() {
	       $scope.calendar = CalendarStore.getCalendar();
		}
		
       	// Init
		setState();
		
		// Binding 
		$scope.$on(CalendarStore.id, setState)
		
		// Interaction handlers
		
		// unselect current calendar
		$scope.calendarReset = function() {
			$scope.$emit("dispatcher", constants.RESET_CALENDAR)
		}
		// create project
		$scope.createProject = function() {
			$scope.$emit("dispatcher", constants.PROJECT_CREATE)
		}
		
		// refresh projects
		$scope.reload = function() {
			$scope.$emit("dispatcher", constants.PROJECT_REFRESH_LIST)
		}
		
    };
});