define(["moment","Constants"], function (moment, constants) {

	
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
	
	
    return function ($scope, ProjectStore, CalendarStore, TimeStore) {
		var setState = function() {
	       $scope.projects = ProjectStore.getProjects();
		   $scope.start = TimeStore.getStart();
		}
		
		
        // Init
        setState();
		
		// Binding
		[ProjectStore.id, CalendarStore.id, TimeStore.id].forEach(function(id) {
				$scope.$on(id, setState)
		})
		

		// interaction handler
		
		// return style for project time line
		$scope.timelineStyle = function(project) {
			return timeStyle($scope.start, project.start, project.end)
		}
		
		// edit projet
		$scope.editProject = function(project) {
			$scope.$emit("dispatcher", constants.PROJECT_EDIT, {project : angular.copy(project)})
		}
    };
});