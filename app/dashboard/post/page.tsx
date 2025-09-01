import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, ArrowLeft, Smile, Meh, Frown } from "lucide-react"
import Link from "next/link"

export default function PostUpdatePage() {
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
            <h1 className="text-xl font-semibold text-foreground">Share Daily Update</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
            <CardDescription>
              Share your daily update with your support circle. Your mood helps them know when you might need extra
              support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Today's Mood</Label>
                <RadioGroup defaultValue="good" className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Smile className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Good Day</div>
                        <div className="text-sm text-muted-foreground">Feeling well, positive energy</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="okay" id="okay" />
                    <Label htmlFor="okay" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <Meh className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-medium">Okay Day</div>
                        <div className="text-sm text-muted-foreground">Managing, some challenges</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="bad" id="bad" />
                    <Label htmlFor="bad" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <Frown className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium">Tough Day</div>
                        <div className="text-sm text-muted-foreground">Struggling, need extra support</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-muted-foreground">
                  Note: Selecting "Tough Day" will send a gentle notification to your circle members
                </p>
              </div>

              {/* Update Text */}
              <div className="space-y-2">
                <Label htmlFor="update" className="text-base font-medium">
                  Share your update (Optional)
                </Label>
                <Textarea
                  id="update"
                  placeholder="Tell your circle how you're doing today, what you're grateful for, or what support you might need..."
                  className="min-h-32 bg-input border-border resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Your circle cares about you. Even a few words can help them understand how to support you.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Share Update
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 border-border/50 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Daily Update Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Share both challenges and victories - your circle wants to celebrate with you</p>
            <p>• Be specific about what kind of support would help (meals, rides, company, etc.)</p>
            <p>• It's okay to have tough days - your circle is here to support you through them</p>
            <p>• Even a simple "doing okay today" helps your loved ones know you're thinking of them</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
