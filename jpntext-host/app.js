#!/usr/bin/env node

/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let fs = require('fs');
let util = require('util');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));

app.post('/save/', (req, res, next) => {
	// console.log(req);
	// fs.writeFile('log.txt', util.inspect(req), 'utf8');

	function decodeBase64Image(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
		let response = {};

		if (matches.length !== 3) {
			return new Error('Invalid input string');
		}

		response.type = matches[1];
		response.data = new Buffer(matches[2], 'base64');

		return response;
	}

	var imageBuffer = decodeBase64Image(req.body.img);
	// let buf = new Buffer(data, 'base64');
	fs.writeFile(`${req.body.type}/${req.body.count}-${req.body.chara}-${req.body.index}-${req.body.sample}.png`, imageBuffer.data, 'base64', (err) => {
		if(err)
			console.error(err);

	});

	res.end("saved");
});

var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = 3000;
app.set('port', port);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});