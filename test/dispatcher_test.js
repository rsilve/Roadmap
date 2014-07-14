var dispatcher = require("../javascript/react/dispatcher/Dispatcher")

exports.tests = {
    setUp: function (done) {
        done();
    },

    noop : function(test) {
        test.expect(1);
        var d = new dispatcher();
        var actual = d.noop(true).then(function(v){
            test.equal(true, v, 'noop(x) must always resolve to x');
        }).finally(function() {
            test.done();
        })
    },

    deferOk : function(test) {
        test.expect(1);
        var d = new dispatcher();
        d.defer(function() { return true }).then(function(v){
            test.equal(true, v, 'defer should resolv when defered return true');
        }).finally(function() {
            test.done();
        })
    },
    deferKO : function(test) {
        test.expect(1);
        var d = new dispatcher();
        d.defer(function() { return false }).catch(function(v){
            test.equal(true, true, 'defer should reject when defered return false');
        }).finally(function() {
            test.done();
        })
    },
    register : function(test) {
        test.expect(2);
        var d = new dispatcher();
        var index  = d.register(function() { d.noop() });
        test.equal(0, index, 'register should return an id for registration');
        index  = d.register(function() { d.noop() });
        test.equal(1, index, 'register should return an id for registration');
        test.done();
    },

    dispatch : function(test) {
        test.expect(3);
        var d = new dispatcher();
        d.register(function(p) {
            return d.defer(function() { return p })
        });
        d.register(function(p) {
            return d.defer(function() { return p })
        });

        d.dispatch(true).then(function(v){
            test.equal(2, v.length, 'dispatch should apply all callback');
            test.equal(true, v[0], 'dispatch should return all values');
            test.equal(true, v[1], 'dispatch should return all values');
        }).finally(function() {
            test.done();
        })

    },

    dispatchFail : function(test) {
        test.expect(1);
        var d = new dispatcher();
        d.register(function(p) {
            return d.defer(function() { return false })
        });
        d.register(function(p) {
            return d.defer(function() { return p })
        });

        d.dispatch(true)
            .then(function() { test.ok(false, "dispatch should fail if one callback fail") })
            .catch(function(v){ test.ok(true) })
            .finally(function() {
                test.done();
            })

    },

    dispatchFailAndRecovered : function(test) {
        test.expect(1);
        var d = new dispatcher();
        d.register(function(p) {
            return d.defer(function() { return false })
        });
        d.register(function(p) {
            return d.waitForError(function() { return true })
        });

        d.dispatch(1)
            .then(function() { test.ok(true) })
            .catch(function(v){ test.ok(false, "dispatch should recover after error if recovery is define") })
            .finally(function() {
                test.done();
            })

    },

    dispatchWithDependencies : function(test) {
        test.expect(2);
        var d = new dispatcher();

        var index = d.register(function(p) {
            // this callback will end after all other
            return d.noop(36).delay(200);
        });

        var index2 = d.register(function(p) {
            return d.noop(42);
        });

        var index3 = d.register(function(p) {
            return d.waitFor([index], function(v) {
                test.equal(36, v[0], 'dispatch wait for the promise at index to be completed');
                return Number(v) + 1
            })
        });

        d.register(function(p) {
            return d.waitFor([index2, index3], function(v) {
                var sum = v[0] + v[1];
                test.equal(79, sum, 'dispatch wait for the promise at index2 and index3 to be completed');
                return v
            })
        });

        d.dispatch(56 /* unused value in the test*/ ).finally(function() {
            test.done();
        });

    },

};