export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	callback();
}
import "regenerator-runtime/runtime";
import "core-js/stable";
import { Pool }  from 'pg'
import { data_base ,data_base_real , onDev }  from "./config.json"
const database = onDev? data_base : data_base_real
const pool = new Pool({
	user: database.user,
	password: database.pass,
	host: database.host,
	port: database.port,
	database: database.database,
	max: 100, // 100 requests
	idleTimeoutMillis: 3000 // 3 seconds
})
pool.on('error', function (err, client) {
	if (err) throw err;
});

export {pool}