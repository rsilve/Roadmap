define(['app'], function() {

    describe('dispatcher service', function () {
		var dispatcher;
        var $rootScope;

		// Load the module which contains the directive
		beforeEach(function() {
			var injector = angular.injector(['Roadmap.services', 'ng']);
			dispatcher = injector.get('dispatcher');
			$rootScope = injector.get('$rootScope')
		});
		

        it('should have a register method return an index position', function () {
			var index = dispatcher.register(function() {return 1});
			expect(index).toEqual(0);
			index = dispatcher.register(function() {return 1});
			expect(index).toEqual(1)
        });

        it('should have a dispatch method that succeed if all registered succeed', function () {
		   dispatcher.register(function(p) { return p });
           dispatcher.register(function(p) { return p });
           dispatcher.run(true).then(function(v){
               expect(v.length).toEqual(2);
               expect(v[0]).toBe(true);
               expect(v[1]).toBe(true);
           });
		   $rootScope.$digest();
        });


        it('should have a dispatch method that fail if one registered fail', function () {
			var handlerCatch = jasmine.createSpy('catch');
			var handlerThen = jasmine.createSpy('then');
			
		   dispatcher.register(function(p) { return p });
           dispatcher.register(function(p, ec) { return ec.fail()});
           dispatcher.run(true).then(handlerThen).catch(handlerCatch)
		   $rootScope.$digest();
		   expect(handlerCatch).toHaveBeenCalled();
		   expect(handlerThen).not.toHaveBeenCalled();
        });

        it('should have a waitForError for recovering on dispatch error ', function () {
			var handlerCatch = jasmine.createSpy('catch');
			var handlerThen = jasmine.createSpy('then');

            dispatcher.register(function(p) { return p });
            dispatcher.register(function(p, ec) {
               return ec.fail("FAIL")
           });
           dispatcher.waitForError(function(p, err) { return err });
           dispatcher.run(true).then(handlerThen).catch(handlerCatch)
		   $rootScope.$digest();
		   expect(handlerCatch).not.toHaveBeenCalled();
		   expect(handlerThen).toHaveBeenCalledWith(["FAIL"]);
        });


        it('should have a waitFor method for manage dependencies on dispatch', function () {

            var index = dispatcher.register(function() { return 1 });
            dispatcher.register(function() { return 2 });
            dispatcher.register(function(payload, ec) {
                return ec.waitFor([index])
                    .then(function(v) {
                        expect(v.length).toEqual(1);
                        expect(v[0]).toBe(1);
                        return v[0]+1
                    })
            });
            dispatcher.run(true).then(function(v) {
                expect(v.length).toEqual(3);
                expect(v[0]+v[1]+v[2]).toBe(5);
            });
            $rootScope.$digest();

        });

        it('could be notified for a dispatch', function () {
            var result = 0;
            dispatcher.register(function(p) {
                var f = function(payload) {
                    result = payload.value
                };
                return f(p)
            });
            $rootScope.$emit("dispatcher", "action", {value: 1});
            $rootScope.$digest();
            expect(result).toEqual(1);
        });

    });


});