import { SyncPanel } from './_components/SyncPanel';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'CRM — MailerLite Sync' };

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">CRM</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manually trigger MailerLite sync or review recent run logs.
        </p>
      </div>
      <SyncPanel />
    </main>
  );
}
