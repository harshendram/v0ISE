"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bug, X, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLoggerStore } from "@/app/stores/logger-store"

export default function DebugLogger() {
  const [isOpen, setIsOpen] = useState(false)
  const { logs, clearLogs } = useLoggerStore()

  const downloadLogs = () => {
    const logData = logs.map((log) => ({
      timestamp: log.date.toISOString(),
      type: log.type,
      message: log.message,
      count: log.count || 1,
    }))

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-mentor-logs-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLogColor = (type: string) => {
    if (type.includes("error")) return "text-red-400"
    if (type.includes("server")) return "text-blue-400"
    if (type.includes("client")) return "text-green-400"
    if (type.includes("audio")) return "text-purple-400"
    return "text-white/70"
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-slate-800/80 backdrop-blur-sm border-white/20 text-white hover:bg-slate-700/80"
      >
        <Bug className="w-4 h-4 mr-2" />
        Debug ({logs.length})
      </Button>

      {/* Debug Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-4 right-4 z-40 w-96 max-h-[80vh]"
          >
            <Card className="bg-slate-900/95 backdrop-blur-sm border-white/20 text-white">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Debug Logs</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={downloadLogs} className="text-white/70 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearLogs} className="text-white/70 hover:text-white">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                {logs.length === 0 ? (
                  <p className="text-white/50 text-sm">No logs yet...</p>
                ) : (
                  logs.slice(-50).map((log, index) => (
                    <div key={index} className="text-xs font-mono">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white/40">{log.date.toLocaleTimeString()}</span>
                        <span className={`font-medium ${getLogColor(log.type)}`}>{log.type}</span>
                        {log.count && log.count > 1 && (
                          <span className="bg-white/20 px-1 rounded text-xs">{log.count}x</span>
                        )}
                      </div>
                      <div className="text-white/70 pl-4 border-l border-white/10">
                        {typeof log.message === "string" ? log.message : JSON.stringify(log.message, null, 2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
