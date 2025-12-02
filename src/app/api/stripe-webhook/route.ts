// src/app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata.user_id;
    await supabase.from('profiles').upsert({ id: userId, is_pro: true });
  }

  return NextResponse.json({ received: true });
}

// This line is REQUIRED for raw body (Stripe needs it)
export const config = {
  api: {
    bodyParser: false,
  },
};
