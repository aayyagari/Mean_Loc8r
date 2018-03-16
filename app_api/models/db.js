var mongoose = require('mongoose');
var readLine = require('readline');
var dbURI = 'mongodb://localhost/Loc8r';
var gracefulShutdown;

require('./locations');
require('./users');

mongoose.connect(dbURI);

if(process.platform === 'win32') {
	var r1 = readLine.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	r1.on('SIGINT', function(){
		process.emit("SIGINT");
	});
}

mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(error){
	console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});

gracefulShutdown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

// for app termination
process.on('SIGINT', function() {
	gracefulShutdown('app termination', function() {
		process.exit(0);
	});
});

// for nodemon restart
process.once('SIGUSR2', function() {
	gracefulShutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// for Heroku app termination
process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function() {
		process.exit(0);
	});
});