import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch { return new Response('Webhook error', { status: 400 }); }

  if (event.type === 'checkout.session.completed') {
    const userId = (event.data.object as any).metadata.user_id;
    await supabase.from('profiles').upsert({ id: userId, is_pro: true });
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };