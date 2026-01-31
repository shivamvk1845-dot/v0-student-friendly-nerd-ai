"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, Search } from "lucide-react"

interface StudyInputProps {
  topic: string
  setTopic: (topic: string) => void
  difficulty: string
  setDifficulty: (difficulty: string) => void
  onGenerate: () => void
  isLoading: boolean
}

const difficultyOptions = [
  { value: "easy", label: "Beginner", description: "Simple explanations" },
  { value: "medium", label: "Intermediate", description: "Balanced depth" },
  { value: "hard", label: "Advanced", description: "In-depth details" },
]

export function StudyInput({
  topic,
  setTopic,
  difficulty,
  setDifficulty,
  onGenerate,
  isLoading,
}: StudyInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && topic.trim().length > 0) {
      onGenerate()
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="topic" className="text-base font-medium">
          What do you want to learn?
        </Label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="topic"
            placeholder="e.g., Environmental Science, Quantum Physics, World War II, Machine Learning..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-14 pl-12 pr-4 text-base bg-input/50 border-border focus:border-primary transition-colors"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Enter any topic and I will teach you about it with summaries, explanations, examples, and flashcards.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-medium">Difficulty Level</Label>
        <div className="grid grid-cols-3 gap-3">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDifficulty(option.value)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                difficulty === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-card"
              }`}
            >
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {option.description}
              </div>
              {difficulty === option.value && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={isLoading || topic.trim().length === 0}
        className="w-full gap-2 h-12 text-base font-medium"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating lesson...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Teach Me
          </>
        )}
      </Button>
    </div>
  )
}
