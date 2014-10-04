define([], function () {

	function setState($scope, ProjectStore) {
        ProjectStore.getProjects()
            	.then(function(projects) {
                    $scope.projects = projects
                })
	}
	
    return function ($scope, ProjectStore, CalendarStore) {

        // Get the data
       //setState($scope, ProjectStore)

        // update the data
        $scope.$on(ProjectStore.id, function() {
            setState($scope, ProjectStore)
        })
        $scope.$on(CalendarStore.id, function() {
            setState($scope, ProjectStore)
        })
    };
});