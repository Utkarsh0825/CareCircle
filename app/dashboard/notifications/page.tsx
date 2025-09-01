import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Heart, ArrowLeft, Mail, Bell, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function NotificationSettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Notification Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Email Notifications */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Control when you receive email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Bad Day Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify circle members immediately when you post a "Tough Day" update
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Task Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone claims or comments on your help requests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">New Member Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone joins your circle</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Weekly Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of circle activity and upcoming help requests
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Daily Reminders */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Update Reminders
              </CardTitle>
              <CardDescription>Gentle reminders to share your daily updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable Daily Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get a gentle reminder if you haven't posted an update by a certain time
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  defaultValue="18:00"
                  className="max-w-xs bg-input border-border"
                />
                <p className="text-sm text-muted-foreground">
                  We'll send a gentle reminder if you haven't posted by this time
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Skip Weekends</Label>
                  <p className="text-sm text-muted-foreground">Don't send reminders on Saturday and Sunday</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Circle Member Notifications */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Circle Member Notifications
              </CardTitle>
              <CardDescription>Settings for notifications you receive about other circle members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Member Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when other circle members post updates or responses
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Task Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about task claims and completions in your circle
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Circle Changes</Label>
                  <p className="text-sm text-muted-foreground">Get notified when members join or leave the circle</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Notifications */}
          <Card className="border-border/50 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-400">
                <Bell className="h-5 w-5" />
                Emergency Notifications
              </CardTitle>
              <CardDescription>Critical notifications that cannot be disabled for safety reasons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Login attempts, password changes, and security-related notifications
                  </p>
                </div>
                <Switch checked disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">System Announcements</Label>
                  <p className="text-sm text-muted-foreground">Important updates about the CareCircle platform</p>
                </div>
                <Switch checked disabled />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button>Save Notification Settings</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
