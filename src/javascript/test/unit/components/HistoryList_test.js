define(['components/planning/HistoryList', 'services/Constants', 'app', 'test/mocks/ProjectStoreMock'], function(HistoryList, constants) {

    describe('HistoryList component', function () {
        var $rootScope;
		var $scope;
        var HistoryStore;

		// Load the module which contains the directive
		beforeEach(function() {
            var injector = angular.injector(['Roadmap.services', 'Roadmap.stores',
                'Google.mocks', 'ProjectStore.mock', 'ng']);

            var $controller = injector.get('$controller');
            HistoryStore = injector.get('HistoryStore');
            $rootScope = injector.get('$rootScope');
            $scope = $rootScope.$new();
            $controller(HistoryList, {$scope: $scope, HistoryStore: HistoryStore});

            // init the google mock
            $rootScope.$digest();
		});

        it('should have an initial state ', function () {
            expect($scope.history).toEqual([]);
            expect($scope.progress).toBeFalsy();

        });

        it('should be notified of an operation ', function () {
            $scope.$emit("dispatcher", constants.PROJECT_SAVE, { name: 'project' });
            $rootScope.$digest();
            expect($scope.history.length).toEqual(1);
        });

        it('should notify an undo on the last operation', function () {
            $scope.$emit("dispatcher", constants.PROJECT_SAVE, { name: 'projectA' });
            $scope.$emit("dispatcher", constants.PROJECT_SAVE, { name: 'projectB' });
            $rootScope.$digest();
            expect($scope.history.length).toEqual(2);
            $scope.$emit("dispatcher", constants.UNDO, {data : HistoryStore.last() } );
            $rootScope.$digest();
            expect($scope.history.length).toEqual(1);
            expect($scope.history[0].payload.name).toEqual("projectA");
        });





    });


});