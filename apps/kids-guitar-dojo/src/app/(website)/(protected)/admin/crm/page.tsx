import { SyncPanel } from './_components/SyncPanel';

export const metadata = { title: 'CRM — MailerLite Sync' };

export default function Page() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold">CRM</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manually trigger MailerLite sync or review recent run logs.
        </p>
      </div>
      <SyncPanel />
    </main>
  );
}
