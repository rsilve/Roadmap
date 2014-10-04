/*
 * This module implement a dispatcher
 */

(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["when"], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var when = require("when")
        module.exports = factory(when)
    } else {
        // Browser globals
    }
})(function(when){

   
	
	return Dispatcher
  
});