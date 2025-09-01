import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, ArrowLeft, Utensils, Car, Users, Home, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

const helpCategories = [
  {
    id: "meals",
    name: "Meals",
    icon: Utensils,
    description: "Cooking, meal delivery, or dining together",
    examples: "Dinner for family, lunch prep, grocery shopping",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: Car,
    description: "Rides to appointments, errands, or activities",
    examples: "Doctor visits, pharmacy runs, social outings",
  },
  {
    id: "companionship",
    name: "Companionship",
    icon: Users,
    description: "Emotional support and spending time together",
    examples: "Treatment visits, phone calls, watching movies",
  },
  {
    id: "household",
    name: "Household",
    icon: Home,
    description: "Help with home tasks and maintenance",
    examples: "Cleaning, laundry, yard work, pet care",
  },
]

export default function NewTaskPage() {
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
            <h1 className="text-xl font-semibold text-foreground">Request Help</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Create a Help Request</CardTitle>
            <CardDescription>
              Let your circle know how they can support you. Don't hesitate to ask - they want to help!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">What kind of help do you need?</Label>
                <RadioGroup defaultValue="meals" className="space-y-3">
                  {helpCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <div
                        key={category.id}
                        className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <RadioGroupItem value={category.id} id={category.id} className="mt-1" />
                        <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                              <IconComponent className="h-4 w-4 text-primary" />
                            </div>
                            <div className="font-medium">{category.name}</div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">{category.description}</div>
                          <div className="text-xs text-muted-foreground">Examples: {category.examples}</div>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>

              {/* Task Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    What specifically do you need help with?
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Dinner for 4 people, Ride to doctor's appointment"
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Additional details (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Any specific requirements, preferences, or additional context..."
                    className="min-h-24 bg-input border-border resize-none"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input id="date" type="date" className="bg-input border-border" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-base font-medium">
                    Time
                  </Label>
                  <Input id="time" type="time" className="bg-input border-border" />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Home, City Medical Center, Whole Foods on Main St"
                  className="bg-input border-border"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Create Help Request
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/dashboard/calendar">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 border-border/50 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Requesting Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Be specific about what you need - it helps people know if they can help</p>
            <p>• Include timing and location details to make it easy for helpers</p>
            <p>• Don't worry about being "too much" - your circle wants to support you</p>
            <p>• You can always edit or cancel requests if plans change</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
