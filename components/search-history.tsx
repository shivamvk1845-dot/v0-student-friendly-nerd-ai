"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History, X, Clock, Trash2 } from "lucide-react"

export interface HistoryItem {
  id: string
  topic: string
  difficulty: string
  timestamp: number
}

interface SearchHistoryProps {
  onSelectTopic: (topic: string, difficulty: string) => void
  currentTopic: string
}

const STORAGE_KEY = "studybuddy-history"
const MAX_HISTORY_ITEMS = 20

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch {
        setHistory([])
      }
    }
  }, [])

  const addToHistory = (topic: string, difficulty: string) => {
    const trimmedTopic = topic.trim()
    if (!trimmedTopic) return

    setHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter(
        (item) => item.topic.toLowerCase() !== trimmedTopic.toLowerCase()
      )
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        topic: trimmedTopic,
        difficulty,
        timestamp: Date.now(),
      }
      
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const removeFromHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return { history, addToHistory, removeFromHistory, clearHistory }
}

export function SearchHistory({
  onSelectTopic,
  currentTopic,
}: SearchHistoryProps) {
  const { history, removeFromHistory, clearHistory } = useSearchHistory()
  const [isExpanded, setIsExpanded] = useState(false)

  if (history.length === 0) return null

  const displayedHistory = isExpanded ? history : history.slice(0, 5)

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const difficultyColors: Record<string, string> = {
    easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-5 w-5 text-primary" />
            Recent Searches
          </CardTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="text-muted-foreground hover:text-destructive h-8 px-2"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayedHistory.map((item) => (
            <div
              key={item.id}
              className={`group flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-secondary/50 ${
                currentTopic.toLowerCase() === item.topic.toLowerCase()
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-secondary/30"
              }`}
              onClick={() => onSelectTopic(item.topic, item.difficulty)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.topic}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${difficultyColors[item.difficulty] || difficultyColors.medium}`}
                  >
                    {item.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFromHistory(item.id)
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
        
        {history.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-3 text-muted-foreground"
          >
            {isExpanded ? "Show less" : `Show ${history.length - 5} more`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
