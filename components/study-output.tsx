"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Copy,
  Check,
  FileText,
  ListChecks,
  Layers,
  RotateCcw,
  BookOpen,
  Lightbulb,
} from "lucide-react"

interface Flashcard {
  question: string
  answer: string
}

interface Example {
  title: string
  description: string
}

interface StudyMaterial {
  summary: string
  detailedExplanation: string
  keyPoints: string[]
  examples: Example[]
  flashcards: Flashcard[]
}

interface StudyOutputProps {
  data: StudyMaterial
  onRegenerate: () => void
  isLoading: boolean
  topic: string
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

const cardColors = [
  { 
    front: "from-rose-400 to-pink-500", 
    back: "from-pink-500 to-rose-400",
    icon: "bg-white/20",
    text: "text-white"
  },
  { 
    front: "from-cyan-400 to-blue-500", 
    back: "from-blue-500 to-cyan-400",
    icon: "bg-white/20",
    text: "text-white"
  },
  { 
    front: "from-amber-400 to-orange-500", 
    back: "from-orange-500 to-amber-400",
    icon: "bg-white/20",
    text: "text-white"
  },
  { 
    front: "from-emerald-400 to-teal-500", 
    back: "from-teal-500 to-emerald-400",
    icon: "bg-white/20",
    text: "text-white"
  },
  { 
    front: "from-violet-400 to-purple-500", 
    back: "from-purple-500 to-violet-400",
    icon: "bg-white/20",
    text: "text-white"
  },
  { 
    front: "from-sky-400 to-indigo-500", 
    back: "from-indigo-500 to-sky-400",
    icon: "bg-white/20",
    text: "text-white"
  },
]

function FlashcardItem({ flashcard, index }: { flashcard: Flashcard; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const colors = cardColors[index % cardColors.length]

  return (
    <div
      className="cursor-pointer perspective-1000 group"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative min-h-[200px] transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Question Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className={`h-full rounded-2xl bg-gradient-to-br ${colors.front} p-1 shadow-lg group-hover:shadow-xl transition-shadow`}>
            <div className="h-full rounded-xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm flex flex-col p-5 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
              
              {/* Question badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${colors.icon} w-fit mb-3`}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-white">Question</span>
              </div>
              
              <p className={`text-base font-medium flex-1 flex items-center ${colors.text} relative z-10 leading-relaxed`}>
                {flashcard.question}
              </p>
              
              <div className="flex items-center gap-2 mt-3 text-white/70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="text-xs font-medium">Tap to flip</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Answer Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className={`h-full rounded-2xl bg-gradient-to-br ${colors.back} p-1 shadow-lg`}>
            <div className="h-full rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex flex-col p-5 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10" />
              <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/5" />
              
              {/* Answer badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${colors.icon} w-fit mb-3`}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-xs font-semibold text-white">Answer</span>
              </div>
              
              <p className={`text-base font-medium flex-1 flex items-center ${colors.text} relative z-10 leading-relaxed`}>
                {flashcard.answer}
              </p>
              
              <div className="flex items-center gap-2 mt-3 text-white/70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs font-medium">Tap to flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StudyOutput({
  data,
  onRegenerate,
  isLoading,
  topic,
}: StudyOutputProps) {
  const summaryText = data.summary
  const explanationText = data.detailedExplanation
  const keyPointsText = data.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")
  const examplesText = data.examples
    ?.map((e, i) => `${i + 1}. ${e.title}\n${e.description}`)
    .join("\n\n") || ""
  const flashcardsText = data.flashcards
    .map((f, i) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`)
    .join("\n\n")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{topic}</h2>
          <p className="text-sm text-muted-foreground">Your personalized lesson</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          disabled={isLoading}
          className="gap-1.5 bg-transparent"
        >
          <RotateCcw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Quick Summary
            </CardTitle>
            <CopyButton text={summaryText} label="Copy" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/90">
            {data.summary}
          </p>
        </CardContent>
      </Card>

      {/* Detailed Explanation Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-primary" />
              In-Depth Explanation
            </CardTitle>
            <CopyButton text={explanationText} label="Copy" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground/90">
            {data.detailedExplanation.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Points Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-5 w-5 text-primary" />
              Key Points to Remember
            </CardTitle>
            <CopyButton text={keyPointsText} label="Copy" />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="leading-relaxed text-foreground/90 pt-0.5">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Examples Card */}
      {data.examples && data.examples.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-5 w-5 text-primary" />
                Real-World Examples
              </CardTitle>
              <CopyButton text={examplesText} label="Copy" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.examples.map((example, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                >
                  <h4 className="font-medium text-sm mb-2 text-foreground">
                    {example.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {example.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcards Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-5 w-5 text-primary" />
              Flashcards
            </CardTitle>
            <CopyButton text={flashcardsText} label="Copy All" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Click on any card to flip and reveal the answer
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.flashcards.map((flashcard, index) => (
              <FlashcardItem key={index} flashcard={flashcard} index={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
