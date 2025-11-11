import { Pool, QueryResult, QueryResultRow } from 'pg';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Executa uma query com retry automático em caso de falha de conexão
 * Útil para lidar com conexões que caem temporariamente
 */
export async function queryWithRetry<T extends QueryResultRow = any>(
  pool: Pool,
  text: string,
  params?: any[],
  options: RetryOptions = {}
): Promise<QueryResult<T>> {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await pool.query<T>(text, params);
    } catch (error: any) {
      lastError = error;

      // Erros que indicam problema de conexão temporário (vale a pena retry)
      const isConnectionError =
        error.code === '57P01' || // admin_shutdown
        error.code === '57P02' || // crash_shutdown
        error.code === '57P03' || // cannot_connect_now
        error.code === '08000' || // connection_exception
        error.code === '08003' || // connection_does_not_exist
        error.code === '08006' || // connection_failure
        error.message?.includes('Connection terminated') ||
        error.message?.includes('connection') ||
        error.message?.includes('ECONNREFUSED');

      // Se não é erro de conexão ou já tentamos todas as vezes, lança o erro
      if (!isConnectionError || attempt === maxRetries) {
        throw error;
      }

      console.log(`⚠️  Tentativa ${attempt}/${maxRetries} falhou. Tentando novamente em ${retryDelay}ms...`);
      console.log(`   Erro: ${error.message}`);

      // Aguarda antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }

  // Nunca deve chegar aqui, mas TypeScript precisa
  throw lastError || new Error('Query failed after retries');
}
