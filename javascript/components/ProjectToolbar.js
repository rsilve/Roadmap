define([], function () {

	function setState($scope) {
	}

    return function ($scope, actions) {
			
        // Get the data
        //setState($scope)
        
        // update the data
        //$scope.$on(CalendarStore.id, function() {
		//	setState($scope)
        //})	

		// Interaction handlers
		
		// unselect current calendar
		$scope.calendarReset = function() {
			actions.resetCalendar();
		}
		// create project
		$scope.createProject = function() {
			actions.createProject();
		}
		
    };
});