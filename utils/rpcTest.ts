export interface RPCResult {
    name: string;
    endpoint: string;
    latency: number | 'Timeout';
  }
  
  export function parseJsonConfig<T>(configString: string): T[] {
    if (!configString) return [];
    try {
      const cleanedString = configString.replace(/\s+/g, ' ').trim();
      return JSON.parse(cleanedString);
    } catch (error) {
      console.error('Error parsing JSON config:', error);
      return [];
    }
  }
  
  let cachedFastestEndpoint: RPCResult | null = null;
  
  export function updateFastestEndpoint(results: RPCResult[]) {
    const fastest = results[0];
    if (fastest && fastest.latency !== 'Timeout' && (!cachedFastestEndpoint || fastest.latency < (cachedFastestEndpoint.latency as number))) {
      cachedFastestEndpoint = fastest;
      console.log(`New fastest RPC endpoint: ${fastest.endpoint} (${fastest.latency}ms)`);
    }
  }
  
  export function getFastestRpcEndpoint(): string {
    if (!cachedFastestEndpoint) {
      throw new Error('No RPC endpoint available yet');
    }
    return cachedFastestEndpoint.endpoint;
  }