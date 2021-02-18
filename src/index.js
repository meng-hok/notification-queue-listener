import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config, {amqpUrlReal ,amqpUrl , data_base, data_base_real, onDev} from './config.json';
import {queueConnectionOperation} from "./ampq";
const amqplib = require('amqplib/callback_api');


let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));
const connectionUrl = onDev?  amqpUrl : amqpUrlReal
amqplib.connect(connectionUrl,(err , connection ) =>{
	if (err) {
		console.error(err.stack);
		return process.exit(1);
	}
	queueConnectionOperation(err, connection)
})
// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
