define(['services/Constants', 'app', ], function(constants) {

    describe('ConfirmStore service', function () {
        var ConfirmStore;
        var $rootScope;

        // Load the module which contains the directive
		beforeEach(function() {

            var injector = angular.injector([
                'Roadmap.services', 'Roadmap.stores',
                'ng', 'ngMock']);

            ConfirmStore = injector.get('ConfirmStore');
            $rootScope = injector.get('$rootScope');

		});

        it ('should have a method getConfirms', function() {
            expect(ConfirmStore.getConfirms).toBeDefined();
            expect(ConfirmStore.getConfirms()).toEqual([]);
        });

        it("could be notified a project will be remove", function() {
            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, {project: {id : "projectId"}});
            $rootScope.$digest();
            var confirms = ConfirmStore.getConfirms();
            expect(confirms.length).toEqual(1);
            expect(confirms[0].payload.project.id).toEqual("projectId");
        });

        it("could be notified a confirmation is accepted", function() {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');

            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, {project: {id : "projectId"}});
            $rootScope.$digest();
            var confirms = ConfirmStore.getConfirms();
            expect(confirms.length).toEqual(1);
            expect(confirms[0].payload.project.id).toEqual("projectId");
            confirms[0].defer.promise.then(handlerThen).catch(handlerCatch)
            $rootScope.$emit("dispatcher", constants.CONFIRM_OK, confirms[0]);
            $rootScope.$digest();

            expect(handlerThen).toHaveBeenCalled();
            expect(handlerCatch).not.toHaveBeenCalled();
            confirms = ConfirmStore.getConfirms();
            expect(confirms.length).toEqual(0);

        });

        it("could be notified a confirmation is rejected", function() {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');

            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, {project: {id : "projectId"}});
            $rootScope.$digest();
            var confirms = ConfirmStore.getConfirms();
            expect(confirms.length).toEqual(1);
            expect(confirms[0].payload.project.id).toEqual("projectId");
            confirms[0].defer.promise.then(handlerThen).catch(handlerCatch)
            $rootScope.$emit("dispatcher", constants.CONFIRM_CANCEL, confirms[0]);
            $rootScope.$digest();

            expect(handlerThen).not.toHaveBeenCalled();
            expect(handlerCatch).toHaveBeenCalled();
            confirms = ConfirmStore.getConfirms();
            expect(confirms.length).toEqual(0);

        });

        it("could be notified the main calendar is unset and so reject all pending confirms", function() {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');

            $rootScope.$emit("dispatcher", constants.PROJECT_DESTROY, {project: {id : "projectId"}});
            $rootScope.$digest();
            var confirms = ConfirmStore.getConfirms();
            expect(confirms.length).toEqual(1);
            expect(confirms[0].payload.project.id).toEqual("projectId");
            confirms[0].defer.promise.then(handlerThen).catch(handlerCatch)
            $rootScope.$emit("dispatcher", constants.SET_CALENDAR, {calendar : "id"});
            $rootScope.$digest();

            expect(handlerThen).not.toHaveBeenCalled();
            expect(handlerCatch).toHaveBeenCalled();
            confirms = ConfirmStore.getConfirms();
            expect(confirms.length).toEqual(0);

        });

    });


});