// pages/api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = Array.isArray(req.query.code) ? req.query.code[0] : req.query.code;

  console.log('→ Recebendo código:', code);
  if (!code) return res.status(400).send('Missing code');

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.NEXT_PUBLIC_BASE_URL || 'https://linux-crm.vercel.app'}/api/auth/callback`
  );

  try {
    const { tokens } = await oauth2.getToken(code);
    res.setHeader('Set-Cookie', serialize('gcal_token', JSON.stringify(tokens), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,  // 30 dias
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }));
    res.redirect('/');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('Erro ao autenticar');
  }
}
