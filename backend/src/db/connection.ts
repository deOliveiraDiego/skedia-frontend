import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_HOST?.includes('supabase.com') ? {
    rejectUnauthorized: false
  } : false,
  connectionTimeoutMillis: 30000, // 30 segundos para conectar
  idleTimeoutMillis: 30000,
  query_timeout: 30000, // 30 segundos para query
  statement_timeout: 30000,
  max: 10,
});

pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com PostgreSQL:', err.message);
  process.exit(-1);
});

// Testar conexão no startup
(async () => {
  try {
    console.log('🔍 Testando conexão com banco...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Banco de dados conectado e funcionando!');
  } catch (error: any) {
    console.error('❌ ERRO ao conectar no banco:');
    console.error('   Mensagem:', error.message);
    console.error('   Host:', process.env.DB_HOST);
    console.error('   Database:', process.env.DB_NAME);
    console.error('   User:', process.env.DB_USER);
  }
})();

export default pool;
