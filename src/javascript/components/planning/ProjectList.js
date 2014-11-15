define(["angular", "services/Constants"], function (angular, constants) {

	
	
	
    return function ($scope, ProjectStore, CalendarStore, ConfirmStore) {
		var setState = function() {
            var confirms = ConfirmStore.getConfirms();
            $scope.deletePending = [];
            angular.forEach(confirms, function(item) {
                if (item.payload.actionType == constants.PROJECT_DESTROY) {
                    $scope.deletePending[item.payload.project.id] = true
                }
            });
	        $scope.projects = ProjectStore.getProjects();
		};
		
		
        // Init
        setState();
		
		// Binding
		[ProjectStore.id, CalendarStore.id, ConfirmStore.id].forEach(function(id) {
				$scope.$on(id, setState)
		});
		

		// interaction handler
		// edit projet
		$scope.editProject = function(project) {
			$scope.$emit("dispatcher", constants.PROJECT_EDIT, {project : angular.copy(project)})
		}
    };
});