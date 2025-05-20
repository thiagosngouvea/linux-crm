// pages/api/calendar/events.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { parse } from 'cookie';

type Tokens = {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.headers.cookie;
  if (!cookie) return res.status(401).json({ error: 'Não autenticado' });

  const cookies = parse(cookie);
  if (!cookies.gcal_token) return res.status(401).json({ error: 'Token não encontrado' });

  const tokens: Tokens = JSON.parse(cookies.gcal_token);
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2 });
  try {
    const event = req.body;

    console.log("event**************", event);
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Falha ao criar evento' });
  }
}
