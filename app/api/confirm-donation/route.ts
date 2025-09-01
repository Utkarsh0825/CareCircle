import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"

interface DonationConfirmation {
  paymentIntentId: string
  amount: number
  donorEmail?: string
  donorName?: string
}

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, amount, donorEmail, donorName }: DonationConfirmation = await request.json()

    // TODO: Verify payment with Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    // if (paymentIntent.status !== 'succeeded') {
    //   return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    // }

    console.log("Donation confirmed:", {
      paymentIntentId,
      amount,
      donorEmail,
      donorName,
    })

    // Store donation record in database
    const donationRecord = {
      id: `don_${Date.now()}`,
      paymentIntentId,
      amount,
      donorEmail,
      donorName,
      createdAt: new Date().toISOString(),
      status: "completed",
    }

    // Send receipt email if email provided
    if (donorEmail) {
      try {
        await EmailService.sendDonationReceipt(
          donorEmail,
          donorName || "Anonymous Donor",
          amount / 100, // Convert from cents to dollars
          donationRecord.id,
        )
      } catch (emailError) {
        console.error("Failed to send receipt email:", emailError)
        // Don't fail the donation confirmation if email fails
      }
    }

    return NextResponse.json({
      success: true,
      donationId: donationRecord.id,
      receiptSent: !!donorEmail,
    })
  } catch (error) {
    console.error("Donation confirmation failed:", error)
    return NextResponse.json({ error: "Failed to confirm donation" }, { status: 500 })
  }
}
