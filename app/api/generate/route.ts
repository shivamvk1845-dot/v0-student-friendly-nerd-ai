import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText, Output } from "ai"
import { z } from "zod"

const studyMaterialsSchema = z.object({
  summary: z.string().min(1),
  detailedExplanation: z.string().min(1),
  keyPoints: z.array(z.string()),
  examples: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
})

function getErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { message: String(error) }
  }

  const providerError = error as Error & {
    statusCode?: number
    responseBody?: string
    url?: string
  }

  return {
    name: error.name,
    message: error.message,
    cause:
      error.cause instanceof Error
        ? `${error.cause.name}: ${error.cause.message}`
        : error.cause,
    statusCode: providerError.statusCode,
    url: providerError.url,
    responseBody: providerError.responseBody,
    stack: error.stack,
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const topic = typeof body?.topic === "string" ? body.topic.trim() : ""
    const difficulty = body?.difficulty

    if (!topic) {
      return Response.json({ error: "No topic provided" }, { status: 400 })
    }

    if (topic.length > 300) {
      return Response.json(
        { error: "Topic must be 300 characters or fewer" },
        { status: 400 },
      )
    }

    const difficultyInstructions = {
      easy: "Explain concepts in simple terms suitable for beginners. Use everyday language and basic examples. Create simple flashcards focusing on definitions and main concepts.",
      medium:
        "Explain concepts with moderate depth suitable for intermediate learners. Include some technical terms with explanations. Create balanced flashcards that test understanding of concepts and relationships.",
      hard: "Provide in-depth, comprehensive explanations suitable for advanced learners. Include technical details, edge cases, and complex relationships. Create challenging flashcards requiring deep understanding and analysis.",
    }

    const selectedDifficulty =
      difficultyInstructions[difficulty as keyof typeof difficultyInstructions] ??
      difficultyInstructions.medium

    const systemPrompt = `You are an expert teacher and study assistant. Your task is to teach students about any topic they ask. You explain concepts clearly, provide detailed information, and create comprehensive study materials.

${selectedDifficulty}

Create a concise 2-4 sentence summary, a comprehensive 3-5 paragraph explanation, 5-7 key points, 2-4 real-world examples, and 6-10 flashcards. Make the lesson accurate, clear, and appropriate for the selected difficulty.`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("[StudyBuddy] GEMINI_API_KEY is not configured")
      return Response.json(
        { error: "Failed to generate study materials. Please try again." },
        { status: 500 },
      )
    }

    const google = createGoogleGenerativeAI({ apiKey })
    const { output } = await generateText({
      model: google("gemini-3.7-flash"),
      system: systemPrompt,
      prompt: `Teach me about: ${topic}`,
      temperature: 0.7,
      output: Output.object({ schema: studyMaterialsSchema }),
    })

    return Response.json(output)
  } catch (error) {
    console.error(
      "[StudyBuddy] Gemini study-material generation failed",
      getErrorDetails(error),
    )
    return Response.json(
      { error: "Failed to generate study materials. Please try again." },
      { status: 500 },
    )
  }
}

export const runtime = "nodejs"
