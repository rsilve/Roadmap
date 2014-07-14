define([], function () {

    return function ($scope, ProjectStore) {

        // Get the data
        $scope.hello = ProjectStore.hello();

        // update the data
        $scope.$on(ProjectStore.id, function() {
            $scope.hello = ProjectStore.hello();
        })
    };
});