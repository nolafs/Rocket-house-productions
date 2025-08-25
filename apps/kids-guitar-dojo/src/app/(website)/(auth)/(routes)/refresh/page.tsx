// app/auth/refresh/page.tsx
import { redirect } from 'next/navigation';
import { SessionFlags } from '@rocket-house-productions/actions/server';

export default async function Page() {
  await SessionFlags();
  redirect('/courses'); // or the last URL
}
