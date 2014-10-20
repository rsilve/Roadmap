define(['app'], function() {

    describe('ExecutionContext service', function () {
		var ec;
        var $rootScope;

		// Load the module which contains the directive
		beforeEach(function() {
			var injector = angular.injector(['Roadmap.services', 'ng']);
            var ExecutionContext = injector.get('ExecutionContext');
            ec = new ExecutionContext();
			$rootScope = injector.get('$rootScope')
		});
		
		
        it('should have a fail method that return a failed  promise', function () {
			var handlerCatch = jasmine.createSpy('catch');
			var handlerThen = jasmine.createSpy('then');
			ec.fail(1).then(handlerThen).catch(handlerCatch)
			$rootScope.$digest();
			expect(handlerCatch).toHaveBeenCalledWith(1);
			expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a when method that return a resolved promise when the parameter a value', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.when(1).then(handlerThen).catch(handlerCatch)
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalledWith(1);
        });

        it('should have a when method that return a resolved promise when no parameter is given', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.when().then(handlerThen).catch(handlerCatch)
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalled();
        });


        it('should have a when method that return promise when the parameter a promise', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.when(ec.fail()).then(handlerThen).catch(handlerCatch)
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalledWith(1);
        });


        it('should have a when method run that generate a promise from a list of callback', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.run([
                function(p, ec) { return 1 },
                function(p, ec) { return 2 }
            ], 1).then(handlerThen).catch(handlerCatch)
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalledWith([1, 2]);
        });

        it('should have a method recover that generate a promise from a list of callback', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.run([], 1).then(ec.recover([
                function(p, ec) { return 1 },
                function(p, ec) { return 2 }
            ], 1)).then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalledWith([1, 2]);
        });

        it('should have a method recover that generate a failed promise from en empty list of callback', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.run([], 1).then(ec.recover([], 1)).then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).toHaveBeenCalled();
            expect(handlerThen).not.toHaveBeenCalled();
        });


        it('should have a method waitFor for help for control execution workflow', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.run([
                function(p, ec) { return p },
                function(p, ec) { return ec.waitFor([0]).then(function(v) { return v[0] + "B" }) }
            ], "A").then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalledWith(["A", "AB"]);
        });

        it('should reject invalid waitFor usage', function () {
            var handlerCatch = jasmine.createSpy('catch');
            var handlerThen = jasmine.createSpy('then');
            ec.run([
                function(p, ec) { return ec.waitFor([1]).then(function(v) { return v[0] + "B" }) },
                function(p, ec) { return p }
            ], "A").then(handlerThen).catch(handlerCatch);
            $rootScope.$digest();
            expect(handlerCatch).not.toHaveBeenCalled();
            expect(handlerThen).toHaveBeenCalledWith(["AB", "A"]);
        });

    });


});