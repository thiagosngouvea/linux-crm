// pages/api/calendar/list.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const cookies = parse(req.headers.cookie || '');

  if (!cookies.gcal_token) {
    return res.status(401).json({ error: 'Não autenticado com Google' });
  }

  const tokens = JSON.parse(cookies.gcal_token);

  const oauth2 = new google.auth.OAuth2();

  console.log('tokens*******', tokens);
  oauth2.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2 });

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(), // Somente eventos futuros
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return res.status(200).json({
      events: response.data.items || [],
    });
  } catch (err: any) {
    console.error('Erro ao listar eventos:', err);
    return res.status(500).json({ error: err.message });
  }
}
