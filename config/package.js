// Creates same object 'config' as defined in package.json

var env = process.env;

var config = { };

for (var prop in env) {
	if (prop.indexOf( 'npm_package_config_' ) === 0) {
		var parts = prop.split( '_' );
		var obj = config;
		for (var i = 3; i < parts.length; i++) {
			var name = parts[i];
			if (obj[name] === undefined) {
				obj[name] = i === (parts.length - 1) ? env[prop] : { };
			}
			obj = obj[ name ];
		}
	}
}

module.exports = config;
