import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const { userId } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/?canceled=true`,
    metadata: { user_id: userId },
  });
  return NextResponse.json({ url: session.url });
}
