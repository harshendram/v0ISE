"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Settings, Volume2, Maximize, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import PageTransition from "@/components/ui/page-transition"
import AudioPulse from "@/components/audio-pulse"
import ControlTray from "@/components/control-tray"
import DebugLogger from "@/components/debug-logger"
import { useLiveAPIContext } from "@/contexts/live-api-context"
import { useToast } from "@/hooks/use-toast"
import type { LiveConfig } from "@/lib/multimodal-live-types"

const voices = [
  { id: "aoede", name: "Aoede - Friendly Doctor", accent: "Warm & Caring" },
  { id: "charon", name: "Charon - Professional Doctor", accent: "Clear & Authoritative" },
  { id: "kore", name: "Kore - Attentive Doctor", accent: "Patient & Supportive" },
  { id: "puck", name: "Puck - Helpful Doctor", accent: "Friendly & Engaging" },
]

export default function AIDoctorPage() {
  const [selectedVoice, setSelectedVoice] = useState("charon")
  const [volume, setVolume] = useState([75])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeVideoStream, setActiveVideoStream] = useState<MediaStream | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState("")
  const [generatingReport, setGeneratingReport] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; text: string }>>([]) // Store Live API conversation
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  // Live API context
  const { connected, volume: audioVolume, setConfig, client } = useLiveAPIContext()

  // AI Chat functionality (fallback for text)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Welcome to the AI Doctor consultation. I'm here to help assess your health. Please speak clearly and answer all questions honestly. Let's begin with some basic information - what is your full name?",
      },
    ],
  })

  // Generate diagnostic report using Gemini text model
  const generateReport = async () => {
    try {
      setGeneratingReport(true)
      
      // Use stored conversation history or fallback to messages
      const convo = conversationHistory.length > 0 
        ? conversationHistory
        : messages.map(m => ({ role: m.role, text: m.content }))
      
      const conversationText = convo
        .map((m) => `${m.role === "user" ? "Patient" : "Doctor"}: ${m.text}`)
        .join("\n\n")

      // Send to report generation API
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: conversationText }),
      })

      if (!response.ok) throw new Error("Failed to generate report")
      const { report } = await response.json()
      
      setReportData(report)
      setShowReport(true)
      toast({
        title: "Report Generated",
        description: "Your medical consultation report has been generated. Review it below.",
      })
    } catch (error) {
      console.error("Report generation error:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
      })
    } finally {
      setGeneratingReport(false)
    }
  }

  // Copy report to clipboard
  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportData)
      toast({
        title: "Copied",
        description: "Report copied to clipboard",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy report",
      })
    }
  }

  // Download report as text file
  const downloadReport = () => {
    const element = document.createElement("a")
    const file = new Blob([reportData], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `ai-doctor-report-${new Date().getTime()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast({
      title: "Downloaded",
      description: "Report downloaded successfully",
    })
  }

  // Track Live API messages
  const addConversationMessage = (role: string, text: string) => {
    setConversationHistory((prev) => [...prev, { role, text }])
  }

  // Listen to Live API content events
  useEffect(() => {
    if (!connected || !client) return

    const handleContent = (content: any) => {
      try {
        // Extract text from model turn
        if (content.modelTurn?.parts) {
          content.modelTurn.parts.forEach((part: any) => {
            if (part.text) {
              addConversationMessage("assistant", part.text)
            }
          })
        }
      } catch (error) {
        console.error("Error tracking content:", error)
      }
    }

    client.on("content", handleContent)
    return () => {
      client.off("content", handleContent)
    }
  }, [connected, client])

  // Configure Gemini Live session whenever voice changes
  useEffect(() => {
    const systemPrompt = `You are a professional AI medical consultant conducting a comprehensive patient consultation. Your role is to:

1. INITIAL INFORMATION (Ask in order):
   - Full name
   - Age
   - Gender
   - Current location/country

2. CHIEF COMPLAINT:
   - Ask: "What brings you in today? Please describe your main health concern."
   - Ask for duration, severity (1-10 scale), and any triggers

3. SYMPTOMS ASSESSMENT:
   - Ask detailed questions about all symptoms
   - Temperature, pain location, duration for each symptom
   - Associated symptoms (nausea, vomiting, dizziness, etc.)

4. MEDICAL HISTORY:
   - Past medical conditions
   - Previous surgeries
   - Current medications (ask for names, dosages)
   - Allergies (medication and food)

5. LIFESTYLE ASSESSMENT:
   - Smoking/alcohol/drug use
   - Sleep patterns
   - Diet and exercise
   - Recent travel
   - Work environment

6. FAMILY HISTORY:
   - Significant family health conditions
   - Genetic conditions

7. PHYSICAL EXAMINATION (Patient-reported):
   - Ask patient to describe visible symptoms
   - Any swelling, rash, or discoloration
   - Areas of tenderness

IMPORTANT GUIDELINES:
- Be empathetic and professional
- Ask ONE question at a time
- Listen carefully and ask follow-up questions
- Never diagnose, only assess and provide observations
- Always recommend seeing a licensed physician
- If patient mentions severe symptoms (chest pain, difficulty breathing, severe bleeding), immediately advise emergency services
- Be thorough but respectful of patient privacy
- Once you have gathered comprehensive information, provide:
  * Summary of reported symptoms
  * Possible areas of concern (NOT a diagnosis)
  * Recommendation to see a specialist
  * Lifestyle suggestions
  * When to seek emergency care

CLOSING:
After gathering all information, state: "Based on our consultation, I recommend scheduling an appointment with a licensed physician to discuss these findings and receive proper diagnosis and treatment."

Remember: You are an AI assistant, not a doctor. Your role is to gather information and facilitate proper medical care.`

    const liveConfig: LiveConfig = {
      model: "models/gemini-2.0-flash-live-001",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: selectedVoice as any,
            },
          },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
    }
    setConfig(liveConfig)
  }, [selectedVoice, setConfig])

  return (
    <PageTransition>
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              AI Doctor Consultation
            </h1>
            <p className="text-xl text-gray-400">Voice-based medical consultation - Speak naturally and answer all questions</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Video Area */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gray-950 border border-gray-800 h-full">
                <div className="aspect-video bg-gray-900 border border-gray-700 rounded-lg mb-6 relative overflow-hidden">
                  {/* Video Element for Screen Share/Webcam */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className={`absolute inset-0 w-full h-full object-contain ${activeVideoStream ? "block" : "hidden"}`}
                  />

                  {/* Audio Visualizer (when no video) */}
                  {connected && !activeVideoStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="mb-8">
                        <motion.div
                          className="w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center"
                          animate={{
                            scale: [1, 1 + audioVolume * 0.3, 1],
                            borderColor: [
                              `rgba(75, 85, 99, 1)`,
                              `rgba(75, 85, 99, ${0.8 + audioVolume * 0.2})`,
                              `rgba(75, 85, 99, 1)`,
                            ],
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                        >
                          <AudioPulse volume={audioVolume} active={connected} />
                        </motion.div>
                      </div>

                      <div className="text-center">
                        <p className="text-white text-lg font-medium mb-2">Doctor Listening...</p>
                        <p className="text-gray-400 text-sm">Speak clearly and naturally</p>
                      </div>
                    </div>
                  )}

                  {/* Default state */}
                  {!connected && !activeVideoStream && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-8 h-8 bg-gray-600 rounded-full" />
                        </div>
                        <p className="text-gray-400">Click "Start Consultation" to begin</p>
                      </div>
                    </div>
                  )}

                  {/* Fullscreen Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-800"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>

                {/* Control Tray */}
                <ControlTray videoRef={videoRef} supportsVideo={true} onVideoStreamChange={setActiveVideoStream} />

                {/* Connection Status */}
                {connected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                  >
                    <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-1 rounded-full text-sm border border-gray-700">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Connected to AI Doctor
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>

            {/* Sidebar Controls */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Voice Selection */}
              <Card className="p-6 bg-gray-950 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Doctor Voice
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Select Voice</label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-950 border-gray-700">
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id} className="text-white hover:bg-gray-800">
                            <div>
                              <div className="font-medium">{voice.name}</div>
                              <div className="text-sm text-gray-400">{voice.accent}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Volume: {volume[0]}%
                    </label>
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
                  </div>
                </div>
              </Card>

              {/* Consultation Transcript */}
              <Card className="p-6 bg-gray-950 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4">Consultation Transcript</h3>

                <div className="h-64 bg-black rounded-lg p-4 mb-4 overflow-y-auto border border-gray-800">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-lg p-3 ${
                          message.role === "user" ? "bg-gray-900 ml-4 border border-gray-700" : "bg-gray-800 mr-4 border border-gray-700"
                        }`}
                      >
                        <p className="text-xs font-semibold text-gray-400 mb-1">
                          {message.role === "user" ? "You" : "Doctor"}
                        </p>
                        <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="bg-gray-800 mr-4 rounded-lg p-3 border border-gray-700">
                        <p className="text-gray-300 text-sm">Doctor is responding...</p>
                      </div>
                    )}
                  </div>
                </div>

                {connected && (
                  <Button 
                    onClick={generateReport} 
                    disabled={generatingReport}
                    className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                  >
                    {generatingReport ? "Generating..." : "Generate Report"}
                  </Button>
                )}
              </Card>

              {/* Consultation Info */}
              <Card className="p-6 bg-gray-950 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4">Consultation Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-medium ${connected ? "text-white" : "text-gray-500"}`}>
                      {connected ? "Active" : "Offline"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Exchanges</span>
                    <span className="text-white font-medium">{Math.floor(messages.length / 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Audio Quality</span>
                    <span className="text-white font-medium">Clear</span>
                  </div>
                  <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
                    <p className="text-xs text-gray-400">
                      ⚠️ This is an AI consultation. Please see a licensed physician for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Report Modal */}
          {showReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
              onClick={() => setShowReport(false)}
            >
              <Card className="bg-gray-950 border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Medical Consultation Report</h2>
                    <Button variant="ghost" onClick={() => setShowReport(false)} className="text-gray-400">
                      ✕
                    </Button>
                  </div>

                  <div className="bg-black rounded-lg p-6 mb-6 font-mono text-sm text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {reportData}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={copyReport} className="flex-1 bg-white text-black hover:bg-gray-200">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                    <Button onClick={downloadReport} className="flex-1 bg-white text-black hover:bg-gray-200">
                      <Download className="w-4 h-4 mr-2" />
                      Download as Text
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <DebugLogger />
        </div>
      </div>
    </PageTransition>
  )
}
