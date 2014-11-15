define(['components/planning/Confirm', 'services/Constants', 'app'], function(Confirm, constants) {

    describe('Confirm component', function () {
        var $rootScope;
		var $scope;

		// Load the module which contains the directive
		beforeEach(function() {
			var injector = angular.injector(['Roadmap.services', 'Roadmap.stores',
                'ng']);

            var $controller = injector.get('$controller');
            var ConfirmStore = injector.get('ConfirmStore');
            $rootScope = injector.get('$rootScope');
            $scope = $rootScope.$new();
            $controller(Confirm, {
                $scope: $scope,
                ConfirmStore: ConfirmStore,
                $interval : injector.get('$interval')
            });


		});

        it('should have an initial state ', function () {
            expect($scope.confirms).toEqual([]);
        });

        it('should be notified on confirm change', function () {
            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, {project: {id : "projectId"}});
            $rootScope.$digest();
            expect($scope.confirms.length).toEqual(1);
        });

        it('could notify confirm validation', function () {
            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, {project: {id : "projectId"}});
            $rootScope.$digest();
            expect($scope.confirms.length).toEqual(1);
            $scope.confirm($scope.confirms[0]);
            $rootScope.$digest();
            expect($scope.confirms.length).toEqual(0);
        });

        it('could notify confirm reject', function () {
            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, {project: {id : "projectId"}});
            $rootScope.$digest();
            expect($scope.confirms.length).toEqual(1);
            $scope.cancel($scope.confirms[0]);
            $rootScope.$digest();
            expect($scope.confirms.length).toEqual(0);
        });





    });


});