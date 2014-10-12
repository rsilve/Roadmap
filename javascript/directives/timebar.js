define([
    'moment',
	'jquery',
	'Constants'
], function (moment,$ , constants) {
	
	// helper for compute timeline style
	var timeStyle = function(ref, start, end, zoom) {
	        var style = { position: "absolute", top: 0 , left: 0, width: 8};

	        var dayStart = start.clone().startOf("day");
	        var dayEnd = end.clone().endOf("day");
	        var dayRef = ref.clone().startOf("day");

	        var offset = dayStart.diff(dayRef);
	        style.left = moment.duration(offset).as(zoom) * 80 + "px";

	        var duration = Math.abs(dayStart.diff(dayEnd));
	        style.width = moment.duration(duration).as(zoom) * 80 + "px";
			return style
	    };
	
    return function (TimeStore) {
		return {
		  scope : {
			project: '=timebar'
		  },
		  link : function(scope, element, attrs) {
			  var style = {}
			  
			  scope.$watch("project.start", updateStyle)
			  scope.$watch("project.end", updateStyle)
			  scope.$on(TimeStore.id, updateStyle)
			  
			  function updateStyle() {
				  style = timeStyle(TimeStore.getStart(), scope.project.start, scope.project.end, TimeStore.getZoom())
				  element.css(style)
			  }
			  
			  var body = angular.element("<div/>").addClass("timebar-body")
			  var leftHand = angular.element("<div/>").addClass("timebar-hand").css("float", "left")
			  var rightHand = angular.element("<div/>").addClass("timebar-hand").css("float", "right")
			  
			  element.append(leftHand).append(rightHand).append(body);
			  
			  var p = null
			  var left = null
			  var width = null;
			  body.bind("mousedown", function(event) {
				  p = event.clientX
				  left = $(element).position().left  
			  }).bind("mousemove", function(event) {
				  
			  }).bind("mouseup", function(event) {
				  
			  })
			  
			  body.on('mousedown', function(event) {
	              event.preventDefault();
				  p = event.clientX
				  left = $(element).position().left 
	              $(document).on('mousemove', move);
	              $(document).on('mouseup', stopmove);
	          });
			  leftHand.on('mousedown', function(event) {
	              event.preventDefault();
				  p = event.clientX
				  width = $(element).width();
				  left = $(element).position().left 
	              $(document).on('mousemove', resizeLeft);
	              $(document).on('mouseup', stopResizeLeft);
	          });
			  rightHand.on('mousedown', function(event) {
	              event.preventDefault();
				  p = event.clientX
				  width = $(element).width();
				  left = $(element).position().left 
	              $(document).on('mousemove', resizeRight);
	              $(document).on('mouseup', stopResizeRight);
	          });
			  
			  function move(event) { 
					element
					.css("left", left + (event.clientX - p) + "px") 
			  }
			  
			  function stopmove(event) {
				  $(document).unbind('mousemove', move);
				  $(document).unbind('mouseup', stopmove);
				  
				  var origin = angular.copy(scope.project)
				  var offset = moment.duration((event.clientX - p)/80, TimeStore.getZoom());
				  scope.$apply(function() {
					  scope.project.start.add(offset.asDays(), "days");
  				  	  scope.project.end.add(offset.asDays(), "days");
				  })
				  scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy(scope.project), from: origin})
			  }
			  
			  function resizeLeft(event) {
				  element.css("left", left + (event.clientX - p) + "px") 
					.css("width", width - (event.clientX - p) + "px" )
			  }
			  
			  function stopResizeLeft(event) {
				  $(document).unbind('mousemove', resizeLeft);
				  $(document).unbind('mouseup', stopResizeLeft);
				  
				  var origin = angular.copy(scope.project)
				  var offset = moment.duration((event.clientX - p)/80, TimeStore.getZoom());
				  scope.$apply(function() {
					  scope.project.start.add(offset.asDays(), "days");
				  })
				  scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy(scope.project), from: origin})
			  }
			  
			  function resizeRight(event) {
				  element 
				  .css("width", width + (event.clientX - p) + "px" )
			  }
			  
			  function stopResizeRight(event) {
				  $(document).unbind('mousemove', resizeRight);
				  $(document).unbind('mouseup', stopResizeRight);
				  
				  var origin = angular.copy(scope.project)
				  var offset = moment.duration((event.clientX - p)/80, TimeStore.getZoom());
				  scope.$apply(function() {
					  scope.project.end.add(offset.asDays(), "days");
				  })
				  scope.$emit("dispatcher", constants.PROJECT_SAVE, {project : angular.copy(scope.project), from: origin})
			  }
			  
			  
			}
		};
    };
});