define(["services/Constants"], function (constants) {

	
    return function ($scope, ProjectEditorStore) {
		var project = null;
		var setState = function() {
	       $scope.project = ProjectEditorStore.getProject();
		   $scope.progress = false;
		   project = angular.copy($scope.project);
           delete $scope.attendee;
		};
		
       	// Init
		setState();
		
		// Binding 
		$scope.$on(ProjectEditorStore.id, setState)
		
		// interaction handler
		
		// cancel edition
		$scope.cancel = function() {
			$scope.$emit("dispatcher", constants.PROJECT_EDIT_CANCEL)
		};
		
		// save project
		$scope.save = function() {
			$scope.progress = true;
			if ($scope.project.id) {
				$scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy($scope.project), from: project})
			} else {
				$scope.$emit("dispatcher", constants.PROJECT_INSERT, {project : angular.copy($scope.project)})
			}
			
		};

        // delete project
        $scope.delete = function() {
            $scope.progress = true;
            $scope.$emit("dispatcher", constants.PROJECT_DESTROY, {project : angular.copy($scope.project), from: project})
        };

        $scope.addAttendee = function() {
            $scope.$emit("dispatcher", constants.ADD_ATTENDEE, {attendee : angular.copy($scope.attendee)})
        };

        $scope.removeAttendee = function(attendee) {
            $scope.$emit("dispatcher", constants.REMOVE_ATTENDEE, {attendee : attendee})
        };

    };
});