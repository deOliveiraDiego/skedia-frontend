import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Suporta connection string ou parâmetros individuais
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 10000, // Timeout para estabelecer conexão
      idleTimeoutMillis: 0, // Não fecha conexões idle (deixa o Supabase gerenciar)
      max: 5, // Reduz pool para evitar sobrecarga
      min: 0, // Permite pool vazio quando não há uso
      keepAlive: true, // Mantém conexões vivas com keep-alive packets
      keepAliveInitialDelayMillis: 10000,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_HOST?.includes('supabase.com')
        ? {
            rejectUnauthorized: false,
          }
        : false,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 0,
      max: 5,
      min: 0,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });

pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com PostgreSQL:', err.message);
  console.error('   (Servidor continuará rodando - pool tentará reconectar automaticamente)');
  // NÃO mata o servidor - o pool do pg reconecta automaticamente
});

// Monitora remoção de clientes do pool
pool.on('remove', () => {
  console.log('⚠️  Cliente removido do pool - pool criará nova conexão quando necessário');
});

// Testar conexão no startup (mas NÃO mata o servidor se falhar)
(async () => {
  try {
    console.log('🔍 Testando conexão com banco...');
    console.log('   Método:', connectionString ? 'CONNECTION_STRING' : 'PARAMETROS');
    if (connectionString) {
      console.log('   Connection String:', connectionString.substring(0, 30) + '...');
    } else {
      console.log('   Host:', process.env.DB_HOST);
      console.log('   Database:', process.env.DB_NAME);
      console.log('   User:', process.env.DB_USER);
    }
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Banco de dados conectado e funcionando!');
    console.log('   Timestamp:', result.rows[0].now);
  } catch (error: any) {
    console.error('❌ ERRO ao conectar no banco:');
    console.error('   Mensagem:', error.message);
    console.error('   Código:', error.code);
    if (connectionString) {
      console.log('   Usando CONNECTION_STRING');
    } else {
      console.error('   Host:', process.env.DB_HOST);
      console.error('   Database:', process.env.DB_NAME);
      console.error('   User:', process.env.DB_USER);
    }
    console.error('⚠️  Servidor vai iniciar MESMO SEM o banco conectado');
    console.error('   As rotas vão retornar erro 500 até o banco conectar');
  }
})();

export default pool;
