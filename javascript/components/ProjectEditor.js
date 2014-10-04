define([], function () {

	function setState($scope, ProjectEditorStore) {
        $scope.project = ProjectEditorStore.getProject()
	}
	
    return function ($scope, actions, ProjectEditorStore) {

        // Get the data
       //setState($scope, ProjectStore)

        // update the data
        $scope.$on(ProjectEditorStore.id, function() {
			console.log("eee")
            setState($scope, ProjectEditorStore)
        })
       
		// interaction handler
		
		// cancel edition
		$scope.cancel = function() {
			actions.cancelEditProject();
		}
    };
});