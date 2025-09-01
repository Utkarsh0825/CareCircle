import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Heart, ArrowLeft, Clock, MapPin, Utensils, MessageCircle, Send, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock task data - in real app this would come from database
const mockTask = {
  id: "1",
  title: "Dinner for family",
  category: "meals",
  date: "2024-02-01",
  time: "6:00 PM",
  description:
    "Could use help with dinner for 4 people. Nothing too spicy please! Maybe something comforting like pasta or soup.",
  location: "Home",
  createdBy: {
    name: "Sarah Johnson",
    avatar: "/diverse-woman-portrait.png",
  },
  claimedBy: {
    name: "Lisa Chen",
    avatar: "/diverse-woman-portrait.png",
    claimedAt: "2 hours ago",
  },
  status: "claimed",
  comments: [
    {
      id: "c1",
      author: "Lisa Chen",
      avatar: "/diverse-woman-portrait.png",
      content: "I'd love to help! I was thinking of making my famous chicken and rice casserole - is that okay?",
      timestamp: "1 hour ago",
    },
    {
      id: "c2",
      author: "Sarah Johnson",
      avatar: "/diverse-woman-portrait.png",
      content: "That sounds perfect! The kids love your casserole. Thank you so much! ❤️",
      timestamp: "45 minutes ago",
    },
  ],
}

export default function TaskDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/calendar">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Help Request Details</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">{mockTask.title}</h2>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                        <Utensils className="h-3 w-3 mr-1" />
                        Meals
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(mockTask.date).toLocaleDateString()} at {mockTask.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockTask.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed mb-6">{mockTask.description}</p>

                {/* Status */}
                {mockTask.claimedBy ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mockTask.claimedBy.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {mockTask.claimedBy.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-green-800 dark:text-green-400">
                        {mockTask.claimedBy.name} is helping with this
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        Claimed {mockTask.claimedBy.claimedAt}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white dark:bg-green-900/30">
                      Contact Helper
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-400">Help still needed</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-500">No one has claimed this task yet</p>
                    </div>
                    <Button size="sm">Claim This Task</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Discussion ({mockTask.comments.length})
                </CardTitle>
                <CardDescription>Coordinate details with your helper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Comments */}
                <div className="space-y-4">
                  {mockTask.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="pt-4 border-t border-border">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/thoughtful-man.png" />
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Add a comment or ask a question..."
                        className="min-h-10 bg-input border-border resize-none"
                      />
                      <Button size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Info */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created by</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={mockTask.createdBy.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {mockTask.createdBy.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{mockTask.createdBy.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    className={
                      mockTask.status === "claimed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }
                  >
                    {mockTask.status === "claimed" ? "Claimed" : "Open"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="text-sm font-medium">Meals</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  Share Task
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Duplicate Task
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
                >
                  Cancel Task
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
