import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export const validateRequest = async (request: Request, secret: string) => {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-signature': headerPayload.get('svix-signature')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
  };
  const wh = new Webhook(secret);

  try {
    console.log('Successfull verify');
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch {
    console.error('incoming webhook failed verification');
    return;
  }
};
