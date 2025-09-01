import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowLeft, Smile, Meh, Frown, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"

// Mock mood data for the past 30 days
const mockMoodData = [
  { date: "2024-01-30", mood: "good" },
  { date: "2024-01-29", mood: "okay" },
  { date: "2024-01-28", mood: "bad" },
  { date: "2024-01-27", mood: "okay" },
  { date: "2024-01-26", mood: "good" },
  { date: "2024-01-25", mood: "good" },
  { date: "2024-01-24", mood: "okay" },
  { date: "2024-01-23", mood: "bad" },
  { date: "2024-01-22", mood: "okay" },
  { date: "2024-01-21", mood: "good" },
  { date: "2024-01-20", mood: "good" },
  { date: "2024-01-19", mood: "okay" },
  { date: "2024-01-18", mood: "good" },
  { date: "2024-01-17", mood: "bad" },
  { date: "2024-01-16", mood: "okay" },
  { date: "2024-01-15", mood: "good" },
  { date: "2024-01-14", mood: "good" },
  { date: "2024-01-13", mood: "okay" },
  { date: "2024-01-12", mood: "good" },
  { date: "2024-01-11", mood: "okay" },
  { date: "2024-01-10", mood: "bad" },
  { date: "2024-01-09", mood: "okay" },
  { date: "2024-01-08", mood: "good" },
  { date: "2024-01-07", mood: "good" },
  { date: "2024-01-06", mood: "okay" },
  { date: "2024-01-05", mood: "good" },
  { date: "2024-01-04", mood: "okay" },
  { date: "2024-01-03", mood: "bad" },
  { date: "2024-01-02", mood: "okay" },
  { date: "2024-01-01", mood: "good" },
]

const getMoodColor = (mood: string) => {
  switch (mood) {
    case "good":
      return "bg-green-500"
    case "okay":
      return "bg-yellow-500"
    case "bad":
      return "bg-red-500"
    default:
      return "bg-gray-300"
  }
}

const getMoodIcon = (mood: string) => {
  switch (mood) {
    case "good":
      return <Smile className="h-4 w-4 text-green-600" />
    case "okay":
      return <Meh className="h-4 w-4 text-yellow-600" />
    case "bad":
      return <Frown className="h-4 w-4 text-red-600" />
    default:
      return <Meh className="h-4 w-4" />
  }
}

// Calculate mood statistics
const moodStats = mockMoodData.reduce(
  (acc, day) => {
    acc[day.mood] = (acc[day.mood] || 0) + 1
    return acc
  },
  {} as Record<string, number>,
)

const totalDays = mockMoodData.length
const goodDaysPercent = Math.round((moodStats.good / totalDays) * 100)
const okayDaysPercent = Math.round((moodStats.okay / totalDays) * 100)
const badDaysPercent = Math.round((moodStats.bad / totalDays) * 100)

export default function MoodTrackerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Mood Tracker</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Smile className="h-5 w-5 text-green-600" />
                  Good Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{goodDaysPercent}%</div>
                <p className="text-sm text-muted-foreground">
                  {moodStats.good || 0} out of {totalDays} days
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Meh className="h-5 w-5 text-yellow-600" />
                  Okay Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{okayDaysPercent}%</div>
                <p className="text-sm text-muted-foreground">
                  {moodStats.okay || 0} out of {totalDays} days
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Frown className="h-5 w-5 text-red-600" />
                  Tough Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{badDaysPercent}%</div>
                <p className="text-sm text-muted-foreground">
                  {moodStats.bad || 0} out of {totalDays} days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mood Calendar */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Past 30 Days
              </CardTitle>
              <CardDescription>Your daily mood tracking history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {mockMoodData.reverse().map((day, index) => {
                  const date = new Date(day.date)
                  const dayNumber = date.getDate()

                  return (
                    <div
                      key={day.date}
                      className="aspect-square flex items-center justify-center rounded-lg border border-border/50 relative group cursor-pointer hover:scale-105 transition-transform"
                    >
                      <div className={`w-6 h-6 rounded-full ${getMoodColor(day.mood)}`} />
                      <span className="absolute bottom-1 text-xs text-muted-foreground">{dayNumber}</span>

                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="flex items-center gap-1">
                          {getMoodIcon(day.mood)}
                          <span className="capitalize">{day.mood} day</span>
                        </div>
                        <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Good Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-sm text-muted-foreground">Okay Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Tough Day</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="border-border/50 bg-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium">You've had more good days than tough days this month</p>
                  <p className="text-xs text-muted-foreground">That's a positive trend worth celebrating!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium">Your circle gets notified on tough days</p>
                  <p className="text-xs text-muted-foreground">This helps them know when to offer extra support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-medium">Consistent tracking helps identify patterns</p>
                  <p className="text-xs text-muted-foreground">Share this data with your healthcare team if helpful</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
