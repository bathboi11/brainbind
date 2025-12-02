import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/lib/supabase';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const { data } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', (session.user as any).id)
        .single();
      (session.user as any).isPro = data?.is_pro || false;
      return session;
    },
  },
});

export { handler as GET, POST };