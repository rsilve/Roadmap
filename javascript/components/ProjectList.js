define([], function () {

	function setState($scope, ProjectStore) {
        ProjectStore.getProjects()
            	.then(function(projects) {
                    $scope.projects = projects
                })
	}
	
    return function ($scope, ProjectStore) {

        // Get the data
       //setState($scope, ProjectStore)

        // update the data
        $scope.$on(ProjectStore.id, function() {
            setState($scope, ProjectStore)
        })
    };
});