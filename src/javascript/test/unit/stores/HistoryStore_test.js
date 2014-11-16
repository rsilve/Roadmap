define(['services/Constants', 'app', 'test/mocks/GoogleMockForCalendar', 'test/mocks/ProjectStoreMock'], function(constants) {

    describe('HistoryStore service', function () {
        var $rootScope;
        var historyStore;

        // Load the module which contains the directive
		beforeEach(function() {

            var injector = angular.injector([
                'Roadmap.services', 'Roadmap.stores',
                'ProjectStore.mock', 'Google.mocks', 'ng', 'ngMock']);

            historyStore = injector.get('HistoryStore');
            $rootScope = injector.get('$rootScope');


		});

        it('should have a getHistory method', function () {
            expect(historyStore.getHistory).toBeDefined();
        });

        it('should have a last method', function () {
            expect(historyStore.last).toBeDefined();
        });

        it('should be notified of project saving', function () {
            $rootScope.$emit("dispatcher", constants.PROJECT_SAVE, { name: 'projectA' });
            $rootScope.$emit("dispatcher", constants.PROJECT_SAVE, { name: 'projectB' });
            $rootScope.$digest();
            expect(historyStore.getHistory().length).toEqual(2)
        });

        it('should be notified of project delete', function () {
            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, { name: 'projectA' });
            $rootScope.$emit("dispatcher", constants.PROJECT_SAVE, { name: 'projectB' });
            $rootScope.$digest();
            expect(historyStore.getHistory().length).toEqual(2)
        });

        it('should be notified of undo action', function () {
            $rootScope.$emit("dispatcher", constants.PROJECT_SAVE, { name: 'projectB' });
            $rootScope.$digest();
            expect(historyStore.getHistory().length).toEqual(1);
            $rootScope.$emit("dispatcher", constants.UNDO, {data : historyStore.last() });
            $rootScope.$digest();
            expect(historyStore.getHistory().length).toEqual(0)
        });



    });


});