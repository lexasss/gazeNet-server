#!/usr/bin/env node
'use strict';

//var app = require( '../app' );
const config = require( './config/package' );
const roles = require( './config/roles' );
//var Records = require('../models/records');
const WebSocketServer = require( 'ws' ).Server;
const EventEmitter = require( 'events' ).EventEmitter;
//var debug = require('debug')(process.env.npm_package_name);

const messageBus = new EventEmitter();
messageBus.setMaxListeners(50);

//var sessions = app.get('sessions');

/*
var server = app.listen( env.web.port, undefined, undefined, function () {
    //debug( 'Express server listening on port ' + server.address().port );
    console.log( 'Express server ' + server.address().address + ' listening on port ' + server.address().port) ;
});
*/

const wss = new WebSocketServer({ port: config.web.port });
console.log( 'WS server listening on port ' + config.web.port ) ;

let lastID = 0;
let clients = {};

wss.on( 'connection', function (ws) {

    const id = 'ID_' + (++lastID);
    const client = {
        sources: [],
        role: roles.none,
        name: ''
    };

    clients[ id ] = client;

    //var session;
    
    let print = function (text) {
        console.log( '[ ' + id + ' ] ' + text) ;
    };

    let parseConfig = function (config) {
        print( 'config = ' + JSON.stringify( config ) );

        let sources = config.sources;
        if (sources instanceof Array) {
            client.sources = sources;
        } else if (typeof sources === 'string') {
            client.sources = [ sources ];
        } else {
            client.sources = [ ];
        }

        //client.page = config.page;
        client.role = config.role ? config.role : roles.none;
        client.name = config.name ? config.name : id;
        
        /*
        if (client.role & roles.sender) {
            session = Records.Session.create( id, config.source );
            sessions.insert( session, dbErrorHandler );
        }
        */
    };

    let parseEvent = function (data) {
        data.from = client.name;
        print( 'event of ' + data.source + ' from ' + data.from + ' = ' + JSON.stringify( data.payload ) );
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

    // {"source": "default", "event": {"aaa": "value", "bbb": 111 }}

    var wsListener = function (data) {
        if (!(client.role & roles.receiver)) {
            return;
        }

        if (client.name == data.from) {
            return;
        }

        var sources = client.sources;
        if (sources && sources.indexOf( data.source ) >= 0) {
            print( 'ws.send: ' + JSON.stringify( data.payload ) );
            ws.send( JSON.stringify({
                payload: data.payload,
                from: data.from
            }));
        } else {
            print( 'data source "' + data .source + '" in not in the list of sources: ' + sources );
        }
    };

    messageBus.on( 'message', wsListener );

    ws.on( 'message', function (data) {
        print( 'Received: ' + data );
        let json; 
        try {
            json = JSON.parse( data );
        }
        catch (ex) {
            print( '    ...not a valid JSON' );
            return;
        }

        if (json.payload) {
            parseEvent( json );
        } else if (json.config) {
            parseConfig( json.config );
        } else {
            print( '?' );
        }
    });

    ws.on( 'close', function () {
        messageBus.removeListener( 'message', wsListener );
        print( 'disconnected' );
        delete clients[ id ];
    });

    print( 'connected' );
});