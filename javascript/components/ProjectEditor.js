define(["Constants"], function (constants) {

	function setState($scope, ProjectEditorStore) {
        $scope.project = ProjectEditorStore.getProject
	}
	
    return function ($scope, ProjectEditorStore) {

       	// Init
		setState($scope, ProjectEditorStore);
		
		// interaction handler
		
		// cancel edition
		$scope.cancel = function() {
			$scope.$emit("dispatcher", constants.PROJECT_EDIT_CANCEL)
		}
		
		// save project
		$scope.save = function() {
			$scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy($scope.project())})
		}
		
		// delete project
		$scope.delete = function() {
			$scope.$emit("dispatcher", constants.PROJECT_DESTROY, {project : angular.copy($scope.project())})
		}
    };
});