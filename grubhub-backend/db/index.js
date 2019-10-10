const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: '18.220.10.109',
  database: process.env.DATABASE_NAME,
  // connectionString: process.env.DATABASE_STRING,
});
module.exports = {
  query: (text, params) => pool.query(text, params),
}
