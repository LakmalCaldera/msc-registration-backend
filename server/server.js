require('./config/config');
const mysqlConnector = require('./db/sequelize');
const path = require('path');
const fs = require('fs');
const { StudentModel } = require('./models');

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.EXPRESS_SERVER_PORT;

const studentUpdateController = require('./dbUpdates/Students');
const studentRegistrationRoutes = require('./routes/StudentRegistration');
const systemConfigRoutes = require('./routes/SystemConfig');

app.use(express.static(__dirname + '/../public'));

// Middleware
app.use(logger('common', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));
app.use(logger('dev'));
app.use(bodyParser());


// Handle form routes
app.use('/config', systemConfigRoutes);
app.use('/registration', studentRegistrationRoutes);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/../public', 'index.html'));
});

// Setup Db
mysqlConnector.sync({force: false}).then(() => {
	console.log("MysqlDb is now ready!");
	mysqlConnector.query("SELECT @@sql_mode;").then((data) => {
		console.log(data)
		mysqlConnector.query("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));").then((data) => {
			mysqlConnector.query("SELECT @@sql_mode;").then((data) => {
				console.log(data)
				studentUpdateController.updateInvalidData()
				studentUpdateController.generateReferenceNumbers()
				// TODO -  Remove this next line in the next iteration
				studentUpdateController.syncIndexNumbers()
			});
		})
	})
}).catch((err) => {
	console.log(`An Error occured while trying to create the models.\n ${err}`);
});

// Start Express Server
app.listen(PORT, function(){
	console.log(`Server started on port ${PORT}...`);
});
