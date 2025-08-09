import { Loader2 } from 'lucide-react';

export default async function Page() {
  return (
    <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
      <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
    </div>
  );
}
