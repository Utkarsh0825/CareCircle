'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Heart, DollarSign, CheckCircle, HelpCircle } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { format } from 'date-fns'
import Link from 'next/link'
import { TourTrigger } from '@/components/tour/tour-trigger'

const DONATION_AMOUNTS = [
  { value: 1000, label: '$10' },
  { value: 2500, label: '$25' },
  { value: 5000, label: '$50' },
  { value: 10000, label: '$100' },
  { value: 25000, label: '$250' },
]

export default function DonatePage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [selectedAmount, setSelectedAmount] = useState<number>(5000)
  const [customAmount, setCustomAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [donationComplete, setDonationComplete] = useState(false)
  const [donationId, setDonationId] = useState('')

  useEffect(() => {
    setSession(getSession())
    setRoot(getRoot())
  }, [])

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const amount = customAmount ? parseInt(customAmount) * 100 : selectedAmount
      
      if (!amount || amount < 100) {
        alert('Please enter a valid amount (minimum $1)')
        return
      }

      const donation = {
        id: `donation-${Date.now()}`,
        groupId: session.group!.id,
        donorUserId: session.user!.id,
        amountCents: amount,
        currency: 'USD' as const,
        status: 'recorded' as const,
        createdAt: new Date().toISOString()
      }

      // Add donation to storage
      updateRoot(prev => ({
        ...prev,
        donations: [...prev.donations, donation]
      }))

      // Send receipt email
      const receiptMail = {
        id: `mail-${Date.now()}`,
        to: [session.user!.email],
        subject: `Thank you for your donation - Receipt #${donation.id}`,
        html: `
          <h2>Thank You for Your Donation</h2>
          <p>Dear ${session.user!.name || session.user!.email},</p>
          <p>Thank you for your generous donation to our care circle. Your support means the world to us.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Donation Details</h3>
            <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
            <p><strong>Date:</strong> ${format(new Date(), 'PPP')}</p>
            <p><strong>Receipt ID:</strong> ${donation.id}</p>
            <p><strong>Circle:</strong> ${session.group!.name}</p>
          </div>
          <p>Your donation will help support our care circle and ensure we can continue providing assistance to those in need.</p>
          <p>With gratitude,<br>The CareCircle Team</p>
        `,
        text: `Thank you for your donation of $${(amount / 100).toFixed(2)} to ${session.group!.name}. Receipt ID: ${donation.id}`,
        createdAt: new Date().toISOString(),
        meta: { type: 'donation-receipt' }
      }

      updateRoot(prev => ({
        ...prev,
        mailbox: [...prev.mailbox, receiptMail]
      }))

      setDonationId(donation.id)
      setDonationComplete(true)
      setRoot(getRoot())
    } catch (error) {
      console.error('Failed to process donation:', error)
      alert('Failed to process donation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const totalDonations = root.donations
    .filter(d => d.groupId === session.group!.id)
    .reduce((sum, d) => sum + d.amountCents, 0)

  if (donationComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
              <p className="text-muted-foreground mb-6">
                Your donation has been recorded successfully. A receipt has been sent to your email.
              </p>
              <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">Receipt ID</p>
                <p className="font-mono text-lg">{donationId}</p>
              </div>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dev-mailbox">View Receipt Email</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">CareCircle</h1>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">Support Our Circle</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard">← Back to Dashboard</Link>
                </Button>
                <TourTrigger page="donate" variant="outline" size="sm" />
              </div>
            </div>
            <CardDescription>
              Your donation helps support our care circle and those in need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="donation-form" onSubmit={handleDonation} className="space-y-6">
              {/* Amount Selection */}
              <div id="amount-selection" className="space-y-3">
                <Label>Select Amount</Label>
                <RadioGroup 
                  value={selectedAmount.toString()} 
                  onValueChange={(value) => setSelectedAmount(parseInt(value))}
                >
                  <div className="grid grid-cols-3 gap-3">
                    {DONATION_AMOUNTS.map((amount) => (
                      <div key={amount.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={amount.value.toString()} id={`amount-${amount.value}`} />
                        <Label htmlFor={`amount-${amount.value}`} className="cursor-pointer">
                          {amount.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Or enter custom amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="custom-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Donation Summary */}
              {session.group && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Donation Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>${((customAmount ? parseInt(customAmount) * 100 : selectedAmount) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Circle:</span>
                      <span>{session.group.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total raised:</span>
                      <span>${(totalDonations / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Complete Donation'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  This is a local demo. In a real application, this would integrate with 
                  payment processors like Stripe.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
