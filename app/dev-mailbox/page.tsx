'use client'

import { useState } from 'react'
import { getRoot, Mail } from '@/lib/localStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { Mail as MailIcon, Calendar, User, HelpCircle } from 'lucide-react'
import { TourTrigger } from '@/components/tour/tour-trigger'
import Link from 'next/link'

export default function DevMailboxPage() {
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null)
  const root = getRoot()
  const mailbox = root.mailbox

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MailIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Developer Mailbox</h1>
          <Badge variant="secondary">Local Emails</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
          <TourTrigger page="dev-mailbox" variant="outline" size="sm" />
        </div>
      </div>

      <div id="mailbox-overview" className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          This mailbox shows all simulated emails sent within the app. In a real deployment, 
          these would be sent via email service providers like SendGrid or Resend.
        </p>
      </div>

      {mailbox.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MailIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No emails yet</h3>
            <p className="text-gray-500">
              Emails will appear here when you trigger actions like posting updates, 
              claiming tasks, or making donations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div id="email-types" className="space-y-4">
          {mailbox.map((mail) => (
            <Card key={mail.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{mail.subject}</h3>
                      {mail.meta?.type && (
                        <Badge variant="outline" className="text-xs">
                          {mail.meta.type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>To: {mail.to.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(mail.createdAt), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMail(mail)}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedMail} onOpenChange={() => setSelectedMail(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMail?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p><strong>To:</strong> {selectedMail?.to.join(', ')}</p>
              <p><strong>Date:</strong> {selectedMail?.createdAt && format(new Date(selectedMail.createdAt), 'PPP p')}</p>
            </div>
            <div className="border-t pt-4">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedMail?.html || '' }}
              />
            </div>
            {selectedMail?.text && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Plain Text Version:</h4>
                <pre className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">
                  {selectedMail.text}
                </pre>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
