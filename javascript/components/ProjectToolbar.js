define(['services/Constants'], function (constants) {


    return function ($scope, CalendarStore, ProjectStore) {
		var setState = function() {
	       $scope.calendar = CalendarStore.getCalendar();
		   $scope.loading = ProjectStore.isLoading();
		}
		
       	// Init
		setState();
		
		// Binding 
		$scope.$on(CalendarStore.id, setState)
		$scope.$on(ProjectStore.loadingEvent(), setState)
		
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

		$scope.zoomDays = function() {
			$scope.$emit("dispatcher", constants.TIME_DAYS)
		}

		$scope.zoomWeeks = function() {
			$scope.$emit("dispatcher", constants.TIME_WEEKS)
		}

		$scope.zoomMonths = function() {
			$scope.$emit("dispatcher", constants.TIME_MONTHS)
		}
		
    };
});