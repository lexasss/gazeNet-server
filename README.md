#GazeNet server
NodeJS server for sharing gaze data and events over the net.

##Dependencies
*   [NodeJS](https://nodejs.org/)

##Config

`config` entry in "package.json" stores the values shared between modules. The values are accessible using `config = require('config/package')` (eg., `var port = config.web.port;`)

##Install and run
Clone the package using git:

    git clone https://github.com/uta-gasp/gazenet-server.git
    cd gazeNetServer

Install dependencies:

    npm install

Run the server (IMPORTANT! run it ONLY using NPM, do not run NOE directly):

    npm start
