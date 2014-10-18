define(["moment","services/Constants"], function (moment, constants) {

	
	
	
    return function ($scope, ProjectStore, CalendarStore) {
		var setState = function() {
	       $scope.projects = ProjectStore.getProjects();
		}
		
		
        // Init
        setState();
		
		// Binding
		[ProjectStore.id, CalendarStore.id].forEach(function(id) {
				$scope.$on(id, setState)
		})
		

		// interaction handler
		// edit projet
		$scope.editProject = function(project) {
			$scope.$emit("dispatcher", constants.PROJECT_EDIT, {project : angular.copy(project)})
		}
    };
});