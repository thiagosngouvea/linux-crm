// pages/api/auth/url.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://linux-crm.vercel.app'}/api/auth/callback`;
  console.log('→ Usando redirect URI:', redirectUri);

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri
  );

  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    prompt: 'consent',
  });

  res.redirect(authUrl);
}
