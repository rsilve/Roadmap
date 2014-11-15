define(["angular", "services/Constants"], function (angular, constants) {

	
	
	
    return function ($scope, ProjectStore) {
		var setState = function() {
            $scope.projects = ProjectStore.getProjects();
		};
		
		
        // Init
        setState();
		
		// Binding
		[ProjectStore.id].forEach(function(id) {
				$scope.$on(id, setState)
		});
		


    };
});