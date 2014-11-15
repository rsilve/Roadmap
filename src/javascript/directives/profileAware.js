define(['services/Constants'], function (constants) {

	
    return function (ProfileStore) {
		
		return {
			controller: function($scope) {
				/**
				 * Helper to set component state on each Stores notification
				 */
				var setState = function () {
					$scope.profile = ProfileStore.getProfile()
				};

				// Init the component
				setState();


				// Bind the component to the stores
				$scope.$on(ProfileStore.id, setState);

				$scope.$on(ProfileStore.id, function() { $scope.$emit("dispatcher", constants.PROFILE_LOADED) })

			}
		};
    };
});