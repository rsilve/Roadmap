define([
    'moment',
	'jquery',
	'Constants'
], function (moment,$ , constants) {
	
	// helper for compute timeline style
	var timeStyle = function(ref, start, end) {
	        var style = { position: "absolute", top: 0 , left: 0, width: 8};

	        var dayStart = start.clone().startOf("day");
	        var dayEnd = end.clone().endOf("day");
	        var dayRef = ref.clone().startOf("day");

	        var offset = dayStart.diff(dayRef);
	        style.left = moment.duration(offset).asMonths() * 80 + "px";

	        var duration = Math.abs(dayStart.diff(dayEnd));
	        style.width = moment.duration(duration).asMonths() * 80 + "px";
			return style
	    };
	
	
    return function () {
		return {
		  scope : {
			project: '=timebar',
			start: '='	
		  },
		  link : function(scope, element, attrs) {
			  var style = {}
			  
			  scope.$watch("project.start", function() {
				  style = timeStyle(scope.start, scope.project.start, scope.project.end)
				  element.css(style)
			  })
			  scope.$watch("project.end", function() {
				  style = timeStyle(scope.start, scope.project.start, scope.project.end)
				  element.css(style)
			  })
			  
 
			  var p = null
			  var left = null
			  element.bind("mousedown", function(event) {
				  p = event.clientX
				  left = $(element).position().left  
			  }).bind("mousemove", function(event) {
				  if (p) {  
					element.css("left", left + (event.clientX - p) + "px") 
				  }
			  }).bind("mouseup", function(event) {
				  var origin = angular.copy(scope.project)
				  var offset = moment.duration((event.clientX - p)/80, "months");
				  p = null;
				  scope.$apply(function() {
					  scope.project.start.add(offset.asDays(), "days");
  				  	  scope.project.end.add(offset.asDays(), "days");
				  })
				  scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy(scope.project), from: origin})
			  })
			}
		};
    };
});