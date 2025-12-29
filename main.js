require('dotenv').config();
const { Client } = require('pg');

console.log('--- Iniciando teste de conexão com main.js ---');

const client = new Client({
  host: process.env.postgres_host,
  user: process.env.postgres_user,
  port: process.env.postgres_port,
  password: process.env.postgres_password,
  database: process.env.postgres_database,
});

client.connect()
  .then(() => {
    console.log(`✅ Conectado com sucesso ao banco de dados: "${client.database}"`);
    return client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
  })
  .then(res => {
    const tables = res.rows.map(row => row.tablename);
    console.log('Tabelas encontradas neste banco de dados:', tables);
    if (!tables.includes('users')) {
      console.warn('⚠️  Aviso: A tabela "users" não foi encontrada neste banco de dados.');
    }
  })
  .catch(err => {
    console.error('❌ Erro durante o teste:', err);
  })
  .finally(() => {
    client.end();
    console.log('--- Teste de conexão finalizado. ---');
  });
