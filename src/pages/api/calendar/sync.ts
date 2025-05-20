// pages/api/calendar/sync.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Método não permitido' });

  const cookies = parse(req.headers.cookie || '');
  if (!cookies.gcal_token)
    return res.status(401).json({ error: 'Não autenticado com Google' });

  const tokens = JSON.parse(cookies.gcal_token);

  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2 });

  const event = req.body;

  try {
    // Buscar eventos no intervalo informado (mesmo horário do novo evento)
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date(event.start.dateTime).toISOString(),
      timeMax: new Date(event.end.dateTime).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const existing = response.data.items?.find(e =>
      e.summary === event.summary &&
      e.start?.dateTime === event.start.dateTime
    );

    if (existing) {
      return res.status(200).json({ message: 'Evento já existe', existing });
    }

    // Criar novo evento
    const created = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return res.status(200).json({ message: 'Evento criado', created: created.data });
  } catch (err: any) {
    console.error('Erro ao sincronizar evento:', err);
    return res.status(500).json({ error: err.message });
  }
}
