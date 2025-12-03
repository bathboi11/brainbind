// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from './supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        const { data } = await supabase
          .from('profiles')
          .select('is_pro')
          .eq('id', (session.user as any).id)
          .single();
        (session.user as any).isPro = data?.is_pro || false;
      }
      return session;
    },
  },
};
