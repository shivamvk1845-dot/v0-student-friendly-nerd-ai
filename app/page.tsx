"use client"

import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { StudyInput } from "@/components/study-input"
import { StudyOutput } from "@/components/study-output"
import { SearchHistory, useSearchHistory } from "@/components/search-history"
import { BookOpen } from "lucide-react"

interface StudyMaterial {
  summary: string
  detailedExplanation: string
  keyPoints: string[]
  examples: { title: string; description: string }[]
  flashcards: { question: string; answer: string }[]
}

function StudyApp() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentTopic, setCurrentTopic] = useState("")
  const { addToHistory } = useSearchHistory()

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsLoading(true)
    setError(null)
    setCurrentTopic(topic)
    
    // Add to history when generating
    addToHistory(topic, difficulty)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate study materials")
      }

      const data = await response.json()
      setStudyMaterial(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">StudyBuddy</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Hero Section with Decorative Elements */}
          <div className="relative text-center space-y-4 py-6">
            {/* Decorative floating elements */}
            <div className="absolute -top-4 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-2xl rotate-12 blur-sm" />
            <div className="absolute top-8 right-1/4 w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-sm" />
            <div className="absolute -bottom-2 left-1/3 w-10 h-10 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-lg -rotate-12 blur-sm" />
            <div className="absolute bottom-4 right-1/3 w-14 h-14 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-2xl rotate-6 blur-sm" />
            
            {/* Illustration */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center">
                  <svg className="w-14 h-14 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                {/* Floating icons around the main icon */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -left-3 w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance relative z-10">
              Learn Anything with{" "}
              <span className="bg-gradient-to-r from-primary via-pink-500 to-orange-400 bg-clip-text text-transparent">
                AI-Powered Lessons
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto text-pretty relative z-10">
              Type any topic and get instant lessons with explanations, examples, and colorful flashcards.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <StudyInput
              topic={topic}
              setTopic={setTopic}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Search History */}
          <SearchHistory
            onSelectTopic={(selectedTopic, selectedDifficulty) => {
              setTopic(selectedTopic)
              setDifficulty(selectedDifficulty)
            }}
            currentTopic={currentTopic}
          />

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          {studyMaterial && (
            <StudyOutput
              data={studyMaterial}
              onRegenerate={handleGenerate}
              isLoading={isLoading}
              topic={currentTopic}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Powered by Grok AI - Your personal AI tutor
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <StudyApp />
    </ThemeProvider>
  )
}
