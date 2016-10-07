#!/usr/bin/env node
'use strict';

const config = require( './config/package' );
const roles = require( './config/roles' );

const WebSocketServer = require( 'ws' ).Server;
const EventEmitter = require( 'events' ).EventEmitter;


/** Parameters **/

const SIMULATE = false;
const DISPLAY_NAMES_MAX_COUNT = 5;


/** Initialization **/

const messageBus = new EventEmitter();
messageBus.setMaxListeners(50);

//var sessions = app.get('sessions');

const wss = new WebSocketServer({ port: config.web.port });
console.log( 'WS server listening on port ' + config.web.port ) ;

let lastID = 0;
let clients = {};


/** Implemenetation **/

//setInterval( displayWhoIsOnline, 5000 );

wss.on( 'connection', function (ws) {

	const id = 'ID_' + (++lastID);
	const client = {
		topics: [],
		role: roles.none,
		name: ''
	};

	clients[ id ] = client;
    
	//var session;

	const print = function (log, skipID) {
		if (log instanceof Array) {
			let intro = skipID ? '\t\t' : '[ ' + id + ' ] ';
			console.log( time() + intro + log.join( '\n\t\t' ) ) ;
		}
		else {
			console.log( (time() + skipID ? '' : '[ ' + id + ' ] ') + log) ;
		}
	};

	const parseConfig = function (config) {
		let topics = config.topics;
		if (topics instanceof Array) {
			client.topics = topics;
		} else if (typeof topics === 'string') {
			client.topics = [ topics ];
		} else {
			client.topics = [ ];
		}

		client.role = config.role ? config.role : roles.none;
		client.name = config.name ? config.name : id;

		print([
			'topics = ' + JSON.stringify( config.topics ),
			'role = ' + roles[ client.role ],
			'name = ' + client.name
		]);
		/*
		if (client.role & roles.sender) {
			session = Records.Session.create( id, config.topic );
			sessions.insert( session, dbErrorHandler );
		}
		*/
		if (SIMULATE) {
			setTimeout( emulateCommands, 3000, ws);
		}
        
        displayWhoIsOnline();
	};

	const parseEvent = function (data) {
		data.from = client.name;
		messageBus.emit( 'message', data );

			/*
		if (client.role & roles.sender) {
			sessions.update(
				{ timestamp: session.timestamp },
				{ $push: { events: Records.Event.create(data.payload) } },
				dbErrorHandler
			);
		}
			*/
	};

	/*
	var dbErrorHandler = function (err, doc) {
		if (err) {
			print('DB ERROR: ' + err);
		}
	};*/

	const wsListener = function (data) {
/*if (data.type == 1) {
	console.log('command:', data.payload);
	if (data.payload.command === 'result') {
		let result = JSON.parse(data.payload.value);
		console.log('result:', result.found);
		gotSearchResult = true;
	}
}*/

		if (!(client.role & roles.receiver) ||
			client.name == data.from ||
			!client.topics) {
			return;
		}

		if (client.topics.indexOf( data.topic ) >= 0) {
			ws.send( JSON.stringify({
				type: data.type,
				from: data.from,
				payload: JSON.stringify( data.payload )
			}), (err) => {
				if (err) {
					print( `Failed to send data from ${data.from}:\n${err.message}` );
				}
			});
		}
		// else {
		// 	print( 'data topic "' + data.topic + '" is not in the list of topics: ' + topics );
		// }
	};

	messageBus.on( 'message', wsListener );

	ws.on( 'message', function (data) {
		let json;
		try {
			json = JSON.parse( data );
		}
		catch (ex) {
			print( '    ...not a valid JSON: ' + data );
			return;
		}

		if (json.payload) {
			parseEvent( json );
		} else if (json.config) {
			parseConfig( json.config );
		} else {
			print( 'Received unclassified data' );
		}
	});

	ws.on( 'close', function () {
		messageBus.removeListener( 'message', wsListener );
		print( client.name + ' disconnected' );
		delete clients[ id ];
        displayWhoIsOnline();
	});

	print( 'connected' );
});

function displayWhoIsOnline() {
	let names = [];
	for (let id in clients) {
		names.push( clients[ id ].name );
	}

    if (names.length > DISPLAY_NAMES_MAX_COUNT) {
        let total = names.length;
        names.length = DISPLAY_NAMES_MAX_COUNT;
        console.log( time() + 'ONLINE: ' + names.join( ', ' ) + ', and ' + (total - DISPLAY_NAMES_MAX_COUNT) + ' more' );
    }
    else {
        console.log( time() + 'ONLINE: ' + (names.length ? names.join( ', ' ) : 'nobody' ) );
    }
}

function time() {
	return new Date().toLocaleTimeString( 'fi-FI', { hour12: false } ) + ' ';
}

/*
const EMULATION_DATA = [ ];

for (var i = 0; i < 1; i++) {
	EMULATION_DATA.push({
		x: 100 + Math.random() * 20,
		y: 100 + Math.random() * 20
	});
}

function emulateGazeEvent (ws, index) {
	index = index || 0;

	ws.send( JSON.stringify({
		topic: 'topic',
		from: 'emulator',
		type: 0,
		payload: JSON.stringify( EMULATION_DATA[ index ] )
	}), (err) => {
		if (err) {
			print( `Failed to send emulated data:\n${err.message}` );
		}

		index++;
		if (index < EMULATION_DATA.length) {
			setTimeout( emulateGazeEvent, 40, ws, index );
		}
	});
}


const COMMANDS = [
//	{dwell: 20, data: { target: 'oinqs', command: 'add', value: { text: "O", x: 100, y: 100 } } },
//	{dwell: 20, data: { target: 'oinqs', command: 'add', value: { text: "Q", x: 200, y: 200 } } },
//	{dwell: 20, data: { target: 'oinqs', command: 'add', value: { text: "Q", x: 200, y: 300 } } },
//	{dwell: 20, data: { target: 'oinqs', command: 'add', value: { text: "Q", x: 300, y: 400 } } },
	{dwell: 20, data: { target: 'oinqs', command: 'add_range', value: [
		{ text: "O", x: 100, y: 100 },
		{ text: "Q", x: 200, y: 200 },
		{ text: "Q", x: 200, y: 300 },
		{ text: "Q", x: 300, y: 400 }
	] } },
	{dwell: 3000, data: { target: 'oinqs', command: 'display', value: '' } },
	{dwell: 2000, data: { target: 'oinqs', command: 'result', value: { found: false } } }
];

const trialCount = 5;
let trialIndex = 0;
let gotSearchResult = false;

function emulateCommands (ws, index) {
	index = index || 0;

	let cmd = COMMANDS[ index ];
	if (cmd.data.command === 'result') {
		cmd.data.value.found = Math.random() > 0.5;
	}
	else if (cmd.data.command === 'add') {
		cmd.data.value.x += Math.round( 50 * (Math.random() - 0.5) );
		cmd.data.value.y += Math.round( 50 * (Math.random() - 0.5) );
	}
	else if (cmd.data.command === 'add_range') {
		for (let i = 0; i < cmd.data.value.length; i += 1) {
			cmd.data.value[i].x += Math.round( 50 * (Math.random() - 0.5) );
			cmd.data.value[i].y += Math.round( 50 * (Math.random() - 0.5) );
		}
	}
	else if (cmd.data.command === 'display') {
		gotSearchResult = false;
	}
	else if (cmd.data.command === 'result') {
		if (gotSearchResult) {
			console.log('skip sending result');
			onSent();
			return;
		}
	}

	let onSent = (err) => {
		if (err) {
			print( `Failed to send emulated commands:\n${err.message}` );
		}

		index++;
		if (index < COMMANDS.length) {
			setTimeout( emulateCommands, cmd.dwell, ws, index );
		}
		else {
			trialIndex++;
			if (trialIndex < trialCount) {
				console.log(' --> repeat');
				setTimeout( emulateCommands, cmd.dwell, ws, 0 );
			}
			else {
				console.log('FINISHED');
			}
		}
	};

	ws.send( JSON.stringify({
		topic: 'topic',
		from: 'emulator',
		type: 1,
		payload: JSON.stringify({
			target: cmd.data.target,
			command: cmd.data.command,
			value: JSON.stringify(cmd.data.value)
		})
	}), onSent);
}
*/