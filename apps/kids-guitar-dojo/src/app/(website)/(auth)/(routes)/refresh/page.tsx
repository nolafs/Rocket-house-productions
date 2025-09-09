// app/auth/refresh/page.tsx
import { redirect } from 'next/navigation';
import { SessionFlags } from '@rocket-house-productions/actions/server';

export default async function Page() {
  const data = await SessionFlags();
  if (data) {
    redirect('/courses');
  } else {
    redirect('/');
  }
}
