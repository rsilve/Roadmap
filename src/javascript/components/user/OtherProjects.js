define(["angular", "services/Constants"], function (angular, constants) {

	
	
	
    return function ($scope, $filter, ProjectStore, ProfileStore) {

		var profileEmail = function() {
			if ($scope.profile && $scope.profile.emails && $scope.profile.emails.length > 0) {
				return $scope.profile.emails[0].value
			}
			return null
		};

		var filter = function(project) {
			var match = true;
			project.attendees.forEach(function (attendee) {
				if (attendee.email === profileEmail()) {
					match = false;
					return;
				}
			})
			return match;
		};


		var setState = function () {
			$scope.projects = ProjectStore.getProjects(filter);
		};


		// Init
		setState();

		// Binding
		[ProjectStore.id, ProfileStore.id].forEach(function (id) {
			$scope.$on(id, setState)
		});

	}
});