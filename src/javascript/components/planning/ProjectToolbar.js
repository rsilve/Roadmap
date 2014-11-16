define(['services/Constants'], function (constants) {


    return function ($scope, CalendarStore, ProjectStore, TimeStore) {
		var setState = function() {
	       	$scope.calendar = CalendarStore.getCalendar();
		   	$scope.loading = ProjectStore.isLoading();
			$scope.timeScale = TimeStore.getZoom();
		};
		
       	// Init
		setState();
		
		// Binding 
		$scope.$on(CalendarStore.id, setState);
		$scope.$on(ProjectStore.loadingEvent(), setState);
		$scope.$on(TimeStore.id, setState);

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

		$scope.isDaysScale = function() {
			return $scope.timeScale === TimeStore.ZOOM_DAYS ? "daysScale" : '';
		}

		$scope.isWeeksScale = function() {
			return $scope.timeScale === TimeStore.ZOOM_WEEKS ? "weeksScale" : '';
		}

		$scope.isMonthsScale = function() {
			return $scope.timeScale === TimeStore.ZOOM_MONTHS ? "monthsScale" : '';
		}

		$scope.poweroff = function() {
			$scope.$emit("dispatcher", constants.LOGOUT)
		}
	};
});