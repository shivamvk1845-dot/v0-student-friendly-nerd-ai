export async function POST(req: Request) {
  try {
    const { topic, difficulty } = await req.json()

    if (!topic || topic.trim().length === 0) {
      return Response.json({ error: "No topic provided" }, { status: 400 })
    }

    const difficultyInstructions = {
      easy: "Explain concepts in simple terms suitable for beginners. Use everyday language and basic examples. Create simple flashcards focusing on definitions and main concepts.",
      medium:
        "Explain concepts with moderate depth suitable for intermediate learners. Include some technical terms with explanations. Create balanced flashcards that test understanding of concepts and relationships.",
      hard: "Provide in-depth, comprehensive explanations suitable for advanced learners. Include technical details, edge cases, and complex relationships. Create challenging flashcards requiring deep understanding and analysis.",
    }

    const systemPrompt = `You are an expert teacher and study assistant. Your task is to teach students about any topic they ask. You explain concepts clearly, provide detailed information, and create comprehensive study materials.

${difficultyInstructions[difficulty as keyof typeof difficultyInstructions] || difficultyInstructions.medium}

IMPORTANT: You MUST respond with ONLY a valid JSON object. No markdown code blocks, no extra text before or after. Just the raw JSON object.

Required JSON format:
{
  "summary": "A concise 2-4 sentence overview of the topic",
  "detailedExplanation": "A comprehensive explanation of the topic (3-5 paragraphs). Cover the main concepts, how they work, why they matter, and any important context.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "examples": [
    {"title": "Example 1 Title", "description": "Detailed real-world example or application"},
    {"title": "Example 2 Title", "description": "Another practical example"}
  ],
  "flashcards": [
    {"question": "Question 1?", "answer": "Answer 1"},
    {"question": "Question 2?", "answer": "Answer 2"}
  ]
}

Guidelines:
- Summary: Write a clear, engaging overview
- Detailed Explanation: Teach the topic thoroughly with well-structured paragraphs
- Key Points: List 5-7 most important facts or concepts
- Examples: Provide 2-4 real-world examples
- Flashcards: Generate 6-10 flashcards covering the key concepts`

    // Call xAI API directly using fetch
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-3-fast",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Teach me about: ${topic}` },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] xAI API error:", response.status, errorText)
      throw new Error(`xAI API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.choices?.[0]?.message?.content

    if (!responseText) {
      throw new Error("Empty response from Grok API")
    }

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = responseText.trim()

    // Remove markdown code block wrappers if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7)
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3)
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3)
    }
    cleanedText = cleanedText.trim()

    // Try to extract JSON object
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[v0] No JSON found in response:", cleanedText.substring(0, 500))
      throw new Error("No JSON found in response")
    }

    const output = JSON.parse(jsonMatch[0])

    // Validate the structure and provide defaults for missing fields
    if (!output.summary) {
      throw new Error("Missing summary in response")
    }

    // Ensure all required fields exist with defaults
    const studyMaterials = {
      summary: output.summary,
      detailedExplanation:
        output.detailedExplanation ||
        output.explanation ||
        "No detailed explanation provided.",
      keyPoints: Array.isArray(output.keyPoints) ? output.keyPoints : [],
      examples: Array.isArray(output.examples) ? output.examples : [],
      flashcards: Array.isArray(output.flashcards) ? output.flashcards : [],
    }

    return Response.json(studyMaterials)
  } catch (error) {
    console.error("Error generating study materials:", error)
    return Response.json(
      { error: "Failed to generate study materials. Please try again." },
      { status: 500 }
    )
  }
}
