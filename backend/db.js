require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.postgres_host,
  user: process.env.postgres_user,
  port: process.env.postgres_port,
  password: process.env.postgres_password,
  database: process.env.postgres_database,
});

// Define o schema padrão para todas as conexões criadas pelo pool
pool.on('connect', (client) => {
  client.query('SET search_path TO petsitting');
});

// Testa a conexão assim que o servidor inicia
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.stack);
  } else {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  }
});

const db = {
  createUser: async (user) => {
    const { id, password_hash, user_type, status, name, email } = user;
    const query = `
      INSERT INTO users (id, created_at, password_hash, user_type, status, name, email)
      VALUES ($1, NOW(), $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, password_hash, user_type, status, name, email]);
    return rows[0];
  },

  getUserByEmail: async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  getUserById: async (id) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  },

  // --- Funções de Pet ---
  createPet: async (pet) => {
    const { id, user_id, name, age, breed, temperament } = pet;
    const query = `
      INSERT INTO pets (id, user_id, name, age, breed, temperament, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, user_id, name, age, breed, temperament]);
    return rows[0];
  },

  getPetsByUserId: async (userId) => {
    const { rows } = await pool.query('SELECT * FROM pets WHERE user_id = $1', [userId]);
    return rows;
  },

  // --- Funções de Agendamento ---
  createBooking: async (booking, petIds) => {
    const client = await pool.connect(); // Pega um cliente do pool para a transação
    try {
      await client.query('BEGIN'); // Inicia a transação

      const bookingQuery = `
        INSERT INTO bookings (id, owner_id, sitter_id, start_datetime, end_datetime, status, care_description, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *;
      `;
      const { id, owner_id, sitter_id, start_datetime, end_datetime, status, care_description } = booking;
      const { rows } = await client.query(bookingQuery, [id, owner_id, sitter_id, start_datetime, end_datetime, status, care_description]);
      const newBooking = rows[0];

      const bookingPetsQuery = 'INSERT INTO booking_pets (booking_id, pet_id) VALUES ($1, $2)';
      for (const petId of petIds) {
        await client.query(bookingPetsQuery, [newBooking.id, petId]);
      }

      await client.query('COMMIT'); // Confirma a transação
      return newBooking;
    } catch (e) {
      await client.query('ROLLBACK'); // Desfaz tudo em caso de erro
      throw e;
    } finally {
      client.release(); // Libera o cliente de volta para o pool
    }
  },

  getBookingsByOwnerId: async (ownerId) => {
    const { rows } = await pool.query('SELECT * FROM bookings WHERE owner_id = $1', [ownerId]);
    return rows;
  },

  // Adicione outras funções conforme necessário (update, delete, etc.)
};

module.exports = { db };
