define(["moment"], function (moment) {

	function setState($scope, ProjectStore) {
        ProjectStore.getProjects()
            	.then(function(projects) {
                    $scope.projects = projects
                })
	}
	
	// helper for compute timeline style
	var timeStyle = function(ref, start, end) {
	        var style = { position: "absolute", top: 0 , left: 0, width: 8};

	        var dayStart = start.clone().startOf("day");
	        var dayEnd = end.clone().endOf("day");
	        var dayRef = ref.clone().startOf("day");

	        var offset = dayStart.diff(dayRef);
	        style.left = moment.duration(offset).asMonths() * 80 + "px";

	        var duration = Math.abs(dayStart.diff(dayEnd));
	        style.width = moment.duration(duration).asMonths() * 80 + "px";
			return style
	    };
	
	
    return function ($scope, actions, ProjectStore, CalendarStore, TimeStore) {

        // Get the data
       //setState($scope, ProjectStore)

        // update the data
        $scope.$on(ProjectStore.id, function() {
            setState($scope, ProjectStore)
        })
        $scope.$on(CalendarStore.id, function() {
            setState($scope, ProjectStore)
        })
		
		// interaction handler
		
		// return style for project time line
		$scope.timelineStyle = function(project) {
			return timeStyle(TimeStore.getStart(), project.start, project.end)
		}
		
		// edit projet
		$scope.editProject = function(project) {
			actions.editProject(angular.copy(project))
		}
    };
});