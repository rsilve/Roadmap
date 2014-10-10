define(["Constants"], function (constants) {

	
    return function ($scope, ProjectEditorStore) {

		var setState = function() {
	       $scope.project = ProjectEditorStore.getProject();
		}
		
       	// Init
		setState();
		
		// Binding 
		$scope.$on(ProjectEditorStore.id, setState)
		
		// interaction handler
		
		// cancel edition
		$scope.cancel = function() {
			$scope.$emit("dispatcher", constants.PROJECT_EDIT_CANCEL)
		}
		
		// save project
		$scope.save = function() {
			$scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy($scope.project)})
		}
		
		// delete project
		$scope.delete = function() {
			$scope.$emit("dispatcher", constants.PROJECT_DESTROY, {project : angular.copy($scope.project)})
		}
    };
});