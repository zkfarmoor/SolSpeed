"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useRpcLatency } from '@/app/hooks/useRpcLatency'

export function RPCTable() {
  const { latencies, isLoading } = useRpcLatency();

  console.log('Latencies:', latencies);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-4xl bg-card border-border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-center py-6">
          <CardTitle className="text-2xl font-bold text-primary-foreground">SolSpeed</CardTitle>
        </CardHeader>
        <CardContent className="bg-card p-8">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground font-medium">Provider</TableHead>
                  <TableHead className="text-muted-foreground font-medium text-right">Latency (ms)</TableHead>
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
                      <TableCell className="text-foreground">
                        <div>{result.name}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {index === 0 && result.latency !== 'Timeout' && (
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                              Fastest
                            </Badge>
                          )}
                          <span className={`font-medium ${result.latency === 'Timeout' ? 'text-destructive' : 'text-foreground'}`}>
                            {result.latency === 'Timeout' ? 'Timeout' : `${result.latency.toFixed(2)}`}
                          </span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}