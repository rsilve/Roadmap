define([
    'moment',
	'pikaday',
], function (moment, Pikaday) {

	
    return function () {
		
		return {
		  scope : {
			  pikaday: '='
		  },
		  link : function(scope, element, attrs) {
			 	new Pikaday({ 
					field: element[0], 
					format: 'DD/MM/YYYY',
					setDefaultDate: true,
					//defaultDate: scope.pikaday
					onOpen : function() {
						this.setMoment(scope.pikaday);
					},
					onSelect : function() {
						var d = this.getMoment()
						scope.$apply(scope.pikaday = d)
					}
				});
			}
		};
    };
});