define(['Constants'], function (constants) {


    return function ($scope, actions) {
			
		// Interaction handlers
		
		// unselect current calendar
		$scope.calendarReset = function() {
			$scope.$emit("dispatcher", constants.RESET_CALENDAR)
		}
		// create project
		$scope.createProject = function() {
			$scope.$emit("dispatcher", constants.PROJECT_CREATE)
		}
		
    };
});