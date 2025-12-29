require('dotenv').config();
const { Client } = require('pg');

const con = new Client({
  host: process.env.postgres_host,
  user: process.env.postgres_user,
  port: process.env.postgres_port,
  password: process.env.postgres_password,
  database: process.env.postgres_database,
});

con
  .connect()
  .then(() => {
    console.log('conectado');
  });
