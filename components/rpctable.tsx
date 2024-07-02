"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useRpcLatency } from '@/app/hooks/useRpcLatency'

export function RPCTable() {
  const { latencies, refetch } = useRpcLatency();
  console.log('Latencies:', latencies);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] text-[#333333]">
      <Card className="w-full max-w-4xl bg-white backdrop-blur-lg border border-[rgba(0,0,0,0.1)] shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#2563eb] to-[#6366f1] text-center py-6">
          <CardTitle className="text-2xl font-bold text-white">SolSpeed</CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#6b7280] font-medium">Provider</TableHead>
                <TableHead className="text-[#6b7280] font-medium text-right">Latency (ms)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {latencies.map((result, index) => (
                  <motion.tr
                    key={result.endpoint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <TableCell className="text-[#333333]">
                      <div>{result.name}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {index === 0 && result.latency !== 'Timeout' && (
                          <Badge variant="default" className="bg-[#2563eb] text-white">
                            Fastest
                          </Badge>
                        )}
                        <span className={`font-medium ${result.latency === 'Timeout' ? 'text-[#ef4444]' : 'text-[#6b7280]'}`}>
                          {result.latency === 'Timeout' ? 'Timeout' : `${result.latency.toFixed(2)}`}
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}