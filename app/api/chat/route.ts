import { google } from "@ai-sdk/google"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: google("gemini-2.0-flash-live-001"),
    messages,
    system:
      "You are a helpful AI study mentor. Provide clear, educational responses to help students learn effectively. Be encouraging and break down complex topics into understandable parts.",
  })

  return result.toDataStreamResponse()
}
