define([], function () {

    return function ($scope, ProjectStore) {

        $scope.hello = ProjectStore.hello();


        $scope.$on(ProjectStore.id, function() {
            $scope.hello = ProjectStore.hello();
        })
    };
});