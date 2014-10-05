define(["moment"], function (moment){
	
    return {
           // local json to Google json
           serialize: function (item) {
               return {
                   id: item.id,
                   summary: item.name,
                   start: { date: item.start.format("YYYY-MM-DD") },
                   end: { date: item.end.format("YYYY-MM-DD") },
                   attendees: item.attendees || [],
                   reminders: { overrides: [] },
                   sequence: item.sequence,
                   description: item.description
               };
           },

           // google json to local json
           deserialize: function deserialize(item) {
               return {
                   id: item.id,
                   name: item.summary,
                   start: moment(item.start.date),
                   end: moment(item.end.date),
                   sequence: item.sequence,
                   description: item.description,
                   attendees: item.attendees || []
               };
           }
       }
	
	
});