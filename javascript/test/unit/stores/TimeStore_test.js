define(['moment', 'services/Constants', 'app'], function(moment, constants) {

    describe('TimeStore service', function () {
		var timestore;
        var $rootScope;

		// Load the module which contains the directive
		beforeEach(function() {
			var injector = angular.injector(['Roadmap.services', 'Roadmap.stores', 'ng']);
            timestore = injector.get('TimeStore');
            $rootScope = injector.get('$rootScope')
		});


        it('should have a getStart method', function () {
            expect(timestore.getStart()).toEqual(moment().startOf('year'));
        });

        it('should have a getZoom method', function () {
            expect(timestore.getZoom()).toEqual("month");
        });

        it('should have a getTicks method', function () {
            var start = timestore.getStart();
            var zoom = timestore.getZoom();
            var ticks = timestore.getTicks();
            for (var i = 0; i < 24; i ++) {
                var d = start.clone().add(i, zoom).startOf(zoom);
                expect(ticks[i].date.toString).toEqual(d.toString);
            }
            expect(ticks.length).toEqual(24);
        });

        it("could be notified to change zoom to days", function() {
            $rootScope.$emit("dispatcher", constants.TIME_DAYS);
            $rootScope.$digest();
            var start = timestore.getStart();
            var zoom = timestore.getZoom();
            expect(zoom).toEqual("day");
            var ticks = timestore.getTicks();
            for (var i = 0; i < 24; i ++) {
                var d = start.clone().add(i, zoom).startOf(zoom);
                expect(ticks[i].date.toString).toEqual(d.toString);
            }
            expect(ticks.length).toEqual(24);
        });

        it("could be notified to change zoom to weeks", function() {
            $rootScope.$emit("dispatcher", constants.TIME_WEEKS);
            $rootScope.$digest();
            var start = timestore.getStart();
            var zoom = timestore.getZoom();
            expect(zoom).toEqual("week");
            var ticks = timestore.getTicks();
            for (var i = 0; i < 24; i ++) {
                var d = start.clone().add(i, zoom).startOf(zoom);
                expect(ticks[i].date.toString).toEqual(d.toString);
            }
            expect(ticks.length).toEqual(24);
        });

        it("could be notified to change zoom to months", function() {
            $rootScope.$emit("dispatcher", constants.TIME_MONTHS);
            $rootScope.$digest();
            var start = timestore.getStart();
            var zoom = timestore.getZoom();
            expect(zoom).toEqual("month");
            var ticks = timestore.getTicks();
            for (var i = 0; i < 24; i ++) {
                var d = start.clone().add(i, zoom).startOf(zoom);
                expect(ticks[i].date.toString).toEqual(d.toString);
            }
            expect(ticks.length).toEqual(24);
        });


        it("could be notified to increment the start date for days zoom", function() {
            $rootScope.$emit("dispatcher", constants.TIME_DAYS);
            $rootScope.$emit("dispatcher", constants.TIME_NEXT_PERIOD);
            $rootScope.$digest();
            var start = timestore.getStart();
            expect(start.toString()).toEqual(moment().startOf('year').add(1, 'weeks').toString());
        });

        it("could be notified to increment the start date for weeks zoom", function() {
            $rootScope.$emit("dispatcher", constants.TIME_WEEKS);
            $rootScope.$digest();
            $rootScope.$emit("dispatcher", constants.TIME_NEXT_PERIOD);
            $rootScope.$digest();
            var start = timestore.getStart();
            expect(start.toString()).toEqual(moment().startOf('year').add(1, 'months').toString());
        });

        it("could be notified to increment the start date for months zoom", function() {
            $rootScope.$emit("dispatcher", constants.TIME_MONTHS);
            $rootScope.$digest();
            $rootScope.$emit("dispatcher", constants.TIME_NEXT_PERIOD);
            $rootScope.$digest();
            var start = timestore.getStart();
            expect(start.toString()).toEqual(moment().startOf('year').add(3, 'months').toString());
        });

        it("could be notified to decrement the start date for days zoom", function() {
            $rootScope.$emit("dispatcher", constants.TIME_DAYS);
            $rootScope.$digest();
            $rootScope.$emit("dispatcher", constants.TIME_PREV_PERIOD);
            $rootScope.$digest();
            var start = timestore.getStart();
            expect(start.toString()).toEqual(moment().startOf('year').subtract(1, 'weeks').toString());
        });

        it("could be notified to decrement the start date for weeks zoom", function() {
            $rootScope.$emit("dispatcher", constants.TIME_WEEKS);
            $rootScope.$digest();
            $rootScope.$emit("dispatcher", constants.TIME_PREV_PERIOD);
            $rootScope.$digest();
            var start = timestore.getStart();
            expect(start.toString()).toEqual(moment().startOf('year').subtract(1, 'months').toString());
        });

        it("could be notified to decrement the start date for months zoom", function() {
            $rootScope.$emit("dispatcher", constants.TIME_MONTHS);
            $rootScope.$digest();
            $rootScope.$emit("dispatcher", constants.TIME_PREV_PERIOD);
            $rootScope.$digest();
            var start = timestore.getStart();
            expect(start.toString()).toEqual(moment().startOf('year').subtract(3, 'months').toString());
        });


    });


});