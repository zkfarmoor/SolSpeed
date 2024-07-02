'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { RPCResult, parseJsonConfig, updateFastestEndpoint } from '@/utils/rpcTest';

export function useRpcLatency() {
  const [latencies, setLatencies] = useState<RPCResult[]>([]);

  const fetchLatencies = async () => {
    if (typeof window === 'undefined') return; // Only run on client side

    const endpointsJson = process.env.NEXT_PUBLIC_RPC_ENDPOINTS;
    if (!endpointsJson) return;

    const endpoints = parseJsonConfig<{ name: string, url: string }>(endpointsJson);
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
  };

  useEffect(() => {
    fetchLatencies();
    const interval = setInterval(fetchLatencies, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return { latencies, refetch: fetchLatencies };
}