import { DialogLayout } from '@rocket-house-productions/lesson';
import { Button } from '@rocket-house-productions/shadcn-ui';

export default async function Page({ params }: { params: { purchaseId: string } }) {
  return (
    <DialogLayout title="Welcome to Kids Guitar Dojo">
      Hello and welcome to Kids Guitar Dojo! I&apos;m truly thrilled to have you and your child as part of our musical
      family. Whether your little one is strumming for the very first time or already has a taste for guitar melodies,
      you&apos;ve chosen an extraordinary path to embark upon. As you dive in know that we&apos;re here to guide and
      support you every step of the way. Our aim is to make learning the guitar an exciting and rewarding experience for
      both you and your child. With our carefully crafted lessons and unique approach, your child will soon be
      discovering the magic of music.
      <div className={'mt-10 w-full'}>
        <Button variant={'lesson'} size={'lg'}>
          Get Started
        </Button>
      </div>
    </DialogLayout>
  );
}
