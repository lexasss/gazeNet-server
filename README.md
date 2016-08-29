#GazeNetServer
NodeJS server for sharing gaze data and events over the net.

##Dependencies
*   [NodeJS](https://nodejs.org/)
*   [MongoDB](https://www.mongodb.org/): The project is configured to start  Mongo from C:\mongodb. If it is installed eslewhere, then set the proper path for `config.db.path` in "package.json".

##Config
There are two places with configuration values stored:

*   `config` entry in "package.json": it stores the values shared between modules
    -   accessible using `config = require('config/package')` (eg., `var port = config.web.port;`)
*   other files in `config/` folder contain module, app or tool -dependent config files:
    -   `mongodb.cfg`: Mongo configuration

##Install and run
Clone the package using git:

    git clone https://github.com/lexasss/gazeNetServer.git

Install depenencies:

    npm install

Run the server:

    npm start
