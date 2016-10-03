#GazeNetServer
NodeJS server for sharing gaze data and events over the net.

##Dependencies
*   [NodeJS](https://nodejs.org/)

##Config
    `config` entry in "package.json": it stores the values shared between modules
    -   accessible using `config = require('config/package')` (eg., `var port = config.web.port;`)

##Install and run
Clone the package using git:

    git clone https://github.com/gasp/gazeNetServer.git

Install depenencies:

    npm install

Run the server:

    npm start
