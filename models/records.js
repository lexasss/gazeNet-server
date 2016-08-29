// Procedures to deal with DB records

var EventRecord = {
    create: function (event) {
        return {
            timestamp: Date.now(),
            event: event
        };
    }
};

var SessionRecord = {
    create: function (id, source) {
        return {
            timestamp: Date.now(),
            id: id,
            source: source,
            events: []
        };
    }
};

module.exports = {
	Event: EventRecord,
	Session: SessionRecord
};