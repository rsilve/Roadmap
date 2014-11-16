define(['services/Constants', 'app', 'test/mocks/GoogleAuthMock'], function(constants) {

    describe('Authentication service', function () {
        var auth;
		var AuthenticationStore;
        var $rootScope;

        // Load the module which contains the directive
		beforeEach(function() {

            var injector = angular.injector([
                'Roadmap.services', 'Roadmap.stores',
                'GoogleAuth.mocks',
                'ng', 'ngMock']);

            AuthenticationStore = injector.get('AuthenticationStore');
            auth = injector.get('GoogleAuth');
            $rootScope = injector.get('$rootScope');

            // init the google mock
            $rootScope.$digest();
		});

        it('should have a getAuth method', function () {
            expect(AuthenticationStore.getAuth).toBeDefined();
        });


        it('should handle authentication success ', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            AuthenticationStore.getAuth().then(handlerThen).catch(handlerCatch);
            auth().resolve();
            $rootScope.$emit("dispatcher", constants.SESSION_LOADED, {session : {}});
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalled();

        });

        it('should handle authentication reject ', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            AuthenticationStore.getAuth().then(handlerThen).catch(handlerCatch);
            auth().reject();
            $rootScope.$emit("dispatcher", constants.SESSION_LOADED, {session : {}});
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();

        });

        it('should handle authentication in session ', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            AuthenticationStore.getAuth().then(handlerThen).catch(handlerCatch);
            $rootScope.$emit("dispatcher", constants.SESSION_LOADED, {session : {auth : 1}});
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalled();

        });


        it('should handle logout', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            $rootScope.$emit("dispatcher", constants.LOGOUT);
            $rootScope.$digest();
            AuthenticationStore.getAuth().then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();

        });

    });


});