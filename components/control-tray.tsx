"use client"

import { memo, type ReactNode, type RefObject, useEffect, useRef, useState } from "react"
import { useLiveAPIContext } from "../contexts/live-api-context"
import type { UseMediaStreamResult } from "../hooks/use-media-stream-mux"
import { useScreenCapture } from "../hooks/use-screen-capture"
import { useWebcam } from "../hooks/use-webcam"
import { AudioRecorder } from "../lib/audio-recorder"
import AudioPulse from "./audio-pulse"
import { Button } from "@/components/ui/button"
import { Video, VideoOff, Monitor, MonitorOff, Mic, MicOff, Phone, PhoneOff, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type ControlTrayProps = {
  videoRef: RefObject<HTMLVideoElement>
  children?: ReactNode
  supportsVideo: boolean
  onVideoStreamChange?: (stream: MediaStream | null) => void
}

type MediaStreamButtonProps = {
  isStreaming: boolean
  onIcon: ReactNode
  offIcon: ReactNode
  start: () => Promise<any>
  stop: () => any
  className?: string
}

/**
 * button used for triggering webcam or screen-capture
 */
const MediaStreamButton = memo(({ isStreaming, onIcon, offIcon, start, stop, className }: MediaStreamButtonProps) =>
  isStreaming ? (
    <Button variant="default" size="lg" onClick={stop} className={`rounded-full ${className}`}>
      {onIcon}
    </Button>
  ) : (
    <Button variant="outline" size="lg" onClick={start} className={`rounded-full ${className}`}>
      {offIcon}
    </Button>
  ),
)

MediaStreamButton.displayName = "MediaStreamButton"

function ControlTray({ videoRef, children, onVideoStreamChange = () => {}, supportsVideo }: ControlTrayProps) {
  const videoStreams = [useWebcam(), useScreenCapture()]
  const [activeVideoStream, setActiveVideoStream] = useState<MediaStream | null>(null)
  const [webcam, screenCapture] = videoStreams
  const [inVolume, setInVolume] = useState(0)
  const [audioRecorder] = useState(() => new AudioRecorder())
  const [muted, setMuted] = useState(false)
  const renderCanvasRef = useRef<HTMLCanvasElement>(null)
  const connectButtonRef = useRef<HTMLButtonElement>(null)

  const { client, connected, connect, disconnect, volume } = useLiveAPIContext()
  const { toast } = useToast()

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus()
    }
  }, [connected])

  const handleConnect = async () => {
    try {
      await connect()
      toast({
        title: "Connected",
        description: "Connected to Gemini Live API",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to connect"
      console.error("Connection error:", error)
      toast({
        title: "Connection Failed",
        description: message,
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: "Disconnected",
        description: "Session ended",
      })
    } catch (error) {
      console.error("Disconnection error:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect properly",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    document.documentElement.style.setProperty("--volume", `${Math.max(5, Math.min(inVolume * 200, 8))}px`)
  }, [inVolume])

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ])
    }
    
    const onVolume = (vol: number) => {
      setInVolume(vol)
    }

    // Start recorder when connected and not muted
    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", onVolume).start()
        .then(() => {
          console.log("Audio recorder started successfully")
        })
        .catch((error) => {
          console.error("Failed to start audio recorder:", error)
        })
    } else {
      // Stop recorder when disconnected or muted
      audioRecorder.stop()
      audioRecorder.off("data", onData).off("volume", onVolume)
    }

    // Cleanup
    return () => {
      audioRecorder.stop()
      audioRecorder.off("data", onData).off("volume", onVolume)
    }
  }, [connected, client, muted, audioRecorder])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = activeVideoStream
    }

    let timeoutId = -1

    function sendVideoFrame() {
      const video = videoRef.current
      const canvas = renderCanvasRef.current

      if (!video || !canvas) {
        return
      }

      const ctx = canvas.getContext("2d")!
      canvas.width = video.videoWidth * 0.25
      canvas.height = video.videoHeight * 0.25
      if (canvas.width + canvas.height > 0) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const base64 = canvas.toDataURL("image/jpeg", 1.0)
        const data = base64.slice(base64.indexOf(",") + 1, Number.POSITIVE_INFINITY)
        client.sendRealtimeInput([{ mimeType: "image/jpeg", data }])
      }
      if (connected) {
        timeoutId = window.setTimeout(sendVideoFrame, 1000 / 0.5)
      }
    }
    if (connected && activeVideoStream !== null) {
      requestAnimationFrame(sendVideoFrame)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [connected, activeVideoStream, client, videoRef])

  //handler for swapping from one video-stream to the next
  const changeStreams = (next?: UseMediaStreamResult) => async () => {
    if (next) {
      const mediaStream = await next.start()
      setActiveVideoStream(mediaStream)
      onVideoStreamChange(mediaStream)
    } else {
      setActiveVideoStream(null)
      onVideoStreamChange(null)
    }

    videoStreams.filter((msr) => msr !== next).forEach((msr) => msr.stop())
  }

  return (
    <section className="flex justify-center gap-3">
      <canvas style={{ display: "none" }} ref={renderCanvasRef} />

      {/* Microphone with Audio Pulse */}
      <div className="flex flex-col items-center gap-2">
        <Button
          variant={!muted ? "default" : "outline"}
          size="lg"
          onClick={() => setMuted(!muted)}
          className={`rounded-full ${!muted ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          disabled={!connected}
        >
          {!muted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
        {connected && (
          <div className="w-12 h-4 bg-white/10 rounded-full flex items-center justify-center">
            <AudioPulse volume={volume} active={connected && !muted} />
          </div>
        )}
      </div>

      {supportsVideo && (
        <>
          <MediaStreamButton
            isStreaming={screenCapture.isStreaming}
            start={changeStreams(screenCapture)}
            stop={changeStreams()}
            onIcon={<MonitorOff className="w-5 h-5" />}
            offIcon={<Monitor className="w-5 h-5" />}
            className={screenCapture.isStreaming ? "bg-blue-600 hover:bg-blue-700" : "bg-white/10 hover:bg-white/20"}
          />
          <MediaStreamButton
            isStreaming={webcam.isStreaming}
            start={changeStreams(webcam)}
            stop={changeStreams()}
            onIcon={<VideoOff className="w-5 h-5" />}
            offIcon={<Video className="w-5 h-5" />}
            className={webcam.isStreaming ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          />
        </>
      )}

      {/* Participants */}
      <Button variant="outline" size="lg" className="rounded-full bg-white/10 hover:bg-white/20">
        <Users className="w-5 h-5" />
      </Button>

      {children}

      {/* Main Session Control */}
      <Button
        ref={connectButtonRef}
        size="lg"
        onClick={connected ? handleDisconnect : handleConnect}
        className={`rounded-full px-8 ${connected ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"}`}
      >
        {connected ? (
          <>
            <PhoneOff className="w-5 h-5 mr-2" />
            End Session
          </>
        ) : (
          <>
            <Phone className="w-5 h-5 mr-2" />
            Start Session
          </>
        )}
      </Button>
    </section>
  )
}

export default memo(ControlTray)
