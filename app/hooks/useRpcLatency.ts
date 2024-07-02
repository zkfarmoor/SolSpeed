'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { RPCResult, updateFastestEndpoint } from '@/utils/rpcTest';

export function useRpcLatency() {
  const [latencies, setLatencies] = useState<RPCResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLatencies = useCallback(async () => {
    if (typeof window === 'undefined') return; // Only run on client side

    const endpointsJson = process.env.NEXT_PUBLIC_RPC_ENDPOINTS;
    if (!endpointsJson) {
      console.error('NEXT_PUBLIC_RPC_ENDPOINTS is not set');
      return;
    }

    let endpoints;
    try {
      endpoints = JSON.parse(endpointsJson);
    } catch (error) {
      console.error('Error parsing RPC_ENDPOINTS:', error);
      return;
    }

    const results: RPCResult[] = [];

    for (const endpoint of endpoints) {
      const start = Date.now();
      try {
        await axios.post(endpoint.url, {
          jsonrpc: '2.0',
          id: 1,
          method: 'getLatestBlockhash',
          params: []
        }, {
          timeout: 5000
        });
        const latency = Date.now() - start;
        results.push({ name: endpoint.name, endpoint: endpoint.url, latency });
      } catch (error) {
        results.push({ name: endpoint.name, endpoint: endpoint.url, latency: 'Timeout' });
      }
    }

    const sortedResults = results.sort((a, b) => {
      if (a.latency === 'Timeout') return 1;
      if (b.latency === 'Timeout') return -1;
      return (a.latency as number) - (b.latency as number);
    });

    updateFastestEndpoint(sortedResults);
    setLatencies(sortedResults);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchLatencies(); // Initial fetch

    const interval = setInterval(fetchLatencies, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [fetchLatencies]);

  return { latencies, isLoading, refetch: fetchLatencies };
}