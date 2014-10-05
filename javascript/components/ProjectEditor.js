define([], function () {

	function setState($scope, ProjectEditorStore) {
        $scope.project = ProjectEditorStore.getProject()
	}
	
    return function ($scope, actions, ProjectEditorStore) {

        // update the data
        $scope.$on(ProjectEditorStore.id, function() {
			setState($scope, ProjectEditorStore)
        })
       
		// interaction handler
		
		// cancel edition
		$scope.cancel = function() {
			actions.cancelEditProject();
		}
		
		// save project
		$scope.save = function() {
			actions.saveProject(angular.copy($scope.project));
		}
		
		// delete project
		$scope.delete = function() {
			actions.deleteProject(angular.copy($scope.project));
		}
    };
});