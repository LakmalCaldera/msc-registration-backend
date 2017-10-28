var config = require('./config.json');

Object.keys(config).forEach((key) => {
   	if(!process.env[key]){
   		process.env[key] = config[key];
	}
});
