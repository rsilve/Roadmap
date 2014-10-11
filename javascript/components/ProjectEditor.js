define(["Constants"], function (constants) {

	
    return function ($scope, ProjectEditorStore) {
		var project = null;
		var setState = function() {
	       $scope.project = ProjectEditorStore.getProject();
		   project = angular.copy($scope.project);
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
			$scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy($scope.project), from: project})
		}
		
		// delete project
		$scope.delete = function() {
			$scope.$emit("dispatcher", constants.PROJECT_DESTROY, {project : angular.copy($scope.project), from: project})
		}
    };
});