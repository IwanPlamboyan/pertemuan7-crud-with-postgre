import * as pg from 'pg';
const { Pool } = pg.default;

const pool = new Pool({
  user: 'postgres',
  password: '12345',
  database: 'db_contacts',
  host: 'localhost',
  port: '5432',
});

export default pool;
